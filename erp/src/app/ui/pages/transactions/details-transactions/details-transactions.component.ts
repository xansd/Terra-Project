import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { GetPayments } from 'src/app/payments/application/get-payments.use-cases';
import { IPayments } from 'src/app/payments/domain/payments';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import { GetTransactions } from 'src/app/transactions/application/get-transactions.use-cases';
import { ITransactions } from 'src/app/transactions/domain/transactions';
import searchConfig, {
  TransactionsSearchTypes,
} from 'src/app/ui/components/searcher/search.config';
import { ActiveEntityService } from 'src/app/ui/services/active-entity-service.service';
import { CreateTransactionComponent } from '../../transactions/create-transaction/create-transaction.component';
import { DatetimeHelperService } from 'src/app/shared/application/datetime.helper.service';
import { GetPartnerUseCase } from 'src/app/partners/application/get-partners.use-case';
import { IPartner } from 'src/app/partners/domain/partner';
import { ConfirmDialogComponent } from 'src/app/ui/shared/components/confirm-dialog/confirm-dialog.component';
import { UpdateTransactions } from 'src/app/transactions/application/update-transactions.use-case';
import { ErrorHandlerService } from 'src/app/shared/error/error-handler';

const modalEditOptions: NgbModalOptions = {
  backdrop: 'static',
  keyboard: false,
  size: 'xl',
};

const modalOptions: NgbModalOptions = {
  backdrop: 'static',
  keyboard: false,
};
@Component({
  selector: 'app-details-transactions',
  templateUrl: './details-transactions.component.html',
  styleUrls: ['./details-transactions.component.scss'],
})
export class DetailsTransactionsComponent {
  p = 1;
  id!: string;
  partner!: IPartner;
  private destroy$ = new Subject();
  isLoading: boolean = true;
  options: ITransactions[] = [];
  searchTypes: { label: string; value: TransactionsSearchTypes }[] =
    searchConfig.TRANSACTIONS_TYPES;
  selectInProgress = false;
  transaction!: ITransactions | undefined;
  payments: IPayments[] = [];
  transactionsList: ITransactions[] = [];

  constructor(
    private getTransactionService: GetTransactions,
    private updateTransactionService: UpdateTransactions,
    private modalService: NgbModal,
    private activeEntityService: ActiveEntityService,
    private notifier: NotificationAdapter,
    private paymentsService: GetPayments,
    private partnerService: GetPartnerUseCase,
    private router: Router,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.getTransactionsList();
    this.getActiveEntityId();
    if (this.id) this.getTransaction();
  }

  ngOnDestroy(): void {
    this.activeEntityService.clearActiveEntity();
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getActiveEntityId(): string | void {
    const result = this.activeEntityService.getActiveEntityId() || '';
    if (result) this.id = result;
  }
  getTransactionsList() {
    this.getTransactionService
      .getAllTransactions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (transactionsList: ITransactions[]) => {
          this.options = transactionsList;
          if (transactionsList.length > 0) {
            const lastID = this.getLastTransaction(transactionsList);
            if (lastID && !this.id) {
              this.id = lastID;
              this.getTransaction();
            }
          } else {
            this.isLoading = true;
            this.transaction = undefined;
          }
        },
      });
  }

  getLastTransaction(transactionsList: ITransactions[]): string | undefined {
    if (transactionsList && transactionsList.length > 0) {
      const lastTransaction = transactionsList[transactionsList.length - 1];
      const lastTransactionId = lastTransaction!.transaction_id;
      return lastTransactionId;
    }
    return undefined;
  }

  // openDetails(entity: any) {
  //   this.activeEntityService.setActiveEntity(harvest, harvest.harvest_id!);
  //   this.router.navigateByUrl(PageRoutes.HARVESTS_DETAILS);
  // }

  openCreateTransactionsDialog() {
    const modalRef = this.modalService.open(
      CreateTransactionComponent,
      modalEditOptions
    );
    modalRef.result
      .then((result) => {
        if (result) {
          this.id = '';
          this.getTransactionsList();
        }
      })
      .catch((error) => {
        if (error) console.error(error);
      });
  }

  openConfirmDialog(): void {
    const modalRef = this.modalService.open(ConfirmDialogComponent);
    modalRef.componentInstance.message =
      'ATENCIÓN: La transacción y sus pagos/cobros vinculados serán eliminados.';
    modalRef.result
      .then((result: any) => {
        if (result) {
          this.deleteTransaction();
        }
      })
      .catch((error: any) => {
        if (error) console.error(error);
      });
  }

  deleteTransaction() {
    this.updateTransactionService
      .delete(this.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res.affectedRows > 0) {
            this.notifier.showNotification('success', 'Transacción eliminada');
            this.getTransactionsList();
          } else {
            this.errorHandler.handleUnkonwError(res);
          }
        },
      });
  }

  handleOptionSelected(option: any): void {
    if (!this.selectInProgress) {
      this.selectInProgress = true;
      this.id = option.transaction_id;
      this.getTransaction();

      setTimeout(() => {
        this.selectInProgress = false;
      }, 100);
    }
  }

  getTransaction() {
    if (!this.checkTransactionSelected()) return;
    this.getTransactionService
      .getById(this.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (transaction: ITransactions) => {
          this.id = transaction.transaction_id!;
          this.transaction = transaction;
          console.log(transaction);
          if (transaction.partner_id) {
            this.getPartner(transaction.partner_id);
          }
          this.isLoading = false;
        },
      });
  }

  getPartner(id: string) {
    if (!this.checkTransactionSelected()) return;
    this.partnerService
      .getPartner(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (partner: IPartner) => {
          this.id = partner.partner_id!;
          this.partner = partner;
        },
      });
  }

  checkTransactionSelected(): boolean {
    if (!this.id) {
      this.notifier.showNotification(
        'warning',
        'Elige una transacción primero'
      );
      return false;
    }
    return true;
  }

  formatDate(date: string): string {
    return DatetimeHelperService.dateToView(date);
  }
}
