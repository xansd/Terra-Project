import { Component } from '@angular/core';
import { GetPurchases } from 'src/app/purchases/application/get-purchases.use-cases';
import {
  IPurchase,
  IPurchaseDetails,
} from 'src/app/purchases/domain/purchases';
import { CreatePurchaseComponent } from '../create-purchase/create-purchase.component';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { GetPayments } from 'src/app/payments/application/get-payments.use-cases';
import { UpdatePayments } from 'src/app/payments/application/update-payments.use-case';
import { IPayments } from 'src/app/payments/domain/payments';
import { InvalidAmountError } from 'src/app/payments/domain/payments.exception';
import { DatetimeHelperService } from 'src/app/shared/application/datetime.helper.service';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import { MakePaymentComponent } from 'src/app/ui/components/make-payment/make-payment.component';
import searchConfig, {
  PurchasesSearchTypes,
} from 'src/app/ui/components/searcher/search.config';
import { ActiveEntityService } from 'src/app/ui/services/active-entity-service.service';
import { ConfirmDialogComponent } from 'src/app/ui/shared/components/confirm-dialog/confirm-dialog.component';

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
  selector: 'app-details-purchases',
  templateUrl: './details-purchases.component.html',
  styleUrls: ['./details-purchases.component.scss'],
})
export class DetailsPurchasesComponent {
  id!: string;
  purchase!: IPurchase | undefined;
  payments: IPayments[] = [];
  options: IPurchase[] = [];
  searchTypes: { label: string; value: PurchasesSearchTypes }[] =
    searchConfig.PURCHASES_TYPES;

  private destroy$ = new Subject();
  isLoading: boolean = true;
  selectInProgress = false;
  hidden = true;

  constructor(
    private purchasesService: GetPurchases,
    private modalService: NgbModal,
    private activeEntityService: ActiveEntityService,
    private notifier: NotificationAdapter,
    private getPaymentsService: GetPayments,
    private deletePaymentService: UpdatePayments
  ) {}

  ngOnInit(): void {
    // Carga el buscador
    this.getPurchasesList();
    this.getActiveEntityId();
    if (this.id) this.getPurchase();
  }

  ngOnDestroy(): void {
    this.activeEntityService.clearActiveEntity();
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  /*********************************BUSCADOR************************************/

  getActiveEntityId(): string | void {
    const result = this.activeEntityService.getActiveEntityId() || '';
    if (result) this.id = result;
  }

  getPurchasesList() {
    this.purchasesService
      .getAllPurchases()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (purchasesList: IPurchase[]) => {
          this.options = purchasesList;
          if (purchasesList.length > 0) {
            const lastID = this.getLastPurchase(purchasesList);
            if (lastID && !this.id) {
              this.id = lastID;
              this.getPurchase();
            }
          } else {
            this.isLoading = true;
            this.purchase = undefined;
          }
        },
      });
  }

  getLastPurchase(purchaseList: IPurchase[]): string | undefined {
    if (purchaseList && purchaseList.length > 0) {
      const lastPurchase = purchaseList[purchaseList.length - 1];
      const lastPurchaseId = lastPurchase!.purchase_id;
      return lastPurchaseId;
    }
    return undefined;
  }

  handleOptionSelected(option: any): void {
    if (!this.selectInProgress) {
      this.selectInProgress = true;
      this.id = option.purchase_id;
      this.getPurchase();

      setTimeout(() => {
        this.selectInProgress = false;
      }, 100);
    }
  }

  /*********************************BUSCADOR************************************/

  /*************************************CARGA CULTIVO**************************************/

  getPurchase() {
    if (!this.checkPurchaseSelected()) return;
    this.purchasesService
      .getPurchaseById(this.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (purchase: IPurchase) => {
          this.id = purchase.purchase_id!;
          this.purchase = purchase;
          // this.activeEntityService.setActiveEntity(this.purchase, this.id);
          this.getPayments();
          this.isLoading = false;
        },
      });
  }

  getPayments() {
    if (!this.checkPurchaseSelected()) return;
    this.getPaymentsService
      .getAllByReference(this.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (payments: IPayments[]) => {
          this.payments = payments;
        },
      });
  }

  deletePayment(id: any) {
    if (!this.checkPurchaseSelected()) return;
    this.deletePaymentService
      .delete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res.affectedRows > 0) {
            this.notifier.showNotification('success', 'Pago eliminado');
            this.getPurchase();
          }
        },
      });
  }

  getPendingPayment() {
    if (!this.checkPurchaseSelected()) return;
  }

  checkPurchaseSelected(): boolean {
    if (!this.id) {
      this.notifier.showNotification('warning', 'Elige una compra primero');
      return false;
    }
    return true;
  }

  formatDate(date: string): string {
    return DatetimeHelperService.dateToView(date);
  }

  openCreatePurchaseDialog() {
    const modalRef = this.modalService.open(
      CreatePurchaseComponent,
      modalEditOptions
    );
    modalRef.result
      .then((result) => {
        if (result) {
          this.id = '';
          this.getPurchasesList();
        }
      })
      .catch((error) => {
        if (error) console.error(error);
      });
  }

  openConfirmationDialog(message: string, payment?: IPayments) {
    const modalRef = this.modalService.open(
      ConfirmDialogComponent,
      modalOptions
    );
    modalRef.componentInstance.message = message;
    modalRef.result
      .then((result) => {
        if (result) {
          this.deletePayment(payment?.payment_id);
        }
      })
      .catch((error) => {
        if (error) console.error(error);
      });
  }

  openMakePaymentDialog(purchase: IPurchase, payments: IPayments[]) {
    const modalRef = this.modalService.open(MakePaymentComponent, modalOptions);
    modalRef.componentInstance.id = purchase.purchase_id;
    modalRef.componentInstance.pending = this.getTotalPending(
      purchase,
      payments
    );
    modalRef.result
      .then((result) => {
        if (result) {
          this.getPurchase();
        }
      })
      .catch((error) => {
        if (error) console.error(error);
      });
  }

  getTotal(purchase: IPurchase): number {
    let total = 0;
    try {
      total = this.getPaymentsService.getPurchaseTotalPayment(purchase);
    } catch (error) {
      if (error instanceof InvalidAmountError) {
        this.notifier.showNotification('error', error.message);
      }
    }
    return total;
  }

  getTotalPaid(payments: IPayments[]) {
    let total = 0;
    try {
      total = this.getPaymentsService.getTotalPaid(payments);
    } catch (error) {
      if (error instanceof InvalidAmountError) {
        this.notifier.showNotification('error', error.message);
      }
    }
    return total;
  }

  getTotalPending(purchase: IPurchase, payments: IPayments[]) {
    let total = 0;
    try {
      total = this.getPaymentsService.getTotalPurchasePending(
        purchase,
        payments
      );
    } catch (error) {
      if (error instanceof InvalidAmountError) {
        this.notifier.showNotification('error', error.message);
      }
    }
    return total;
  }

  getTotalAmountOfProductLine(detail: IPurchaseDetails) {
    let total = 0;
    try {
      total = this.purchasesService.getTotalAmountOfProductLine(detail);
    } catch (error) {
      if (error instanceof InvalidAmountError) {
        this.notifier.showNotification('error', error.message);
      }
    }
    return total;
  }

  getTotalQuantityProductLine(detail: IPurchaseDetails) {
    let total = 0;
    try {
      total = this.purchasesService.getTotalQuantityProductLine(detail);
    } catch (error) {
      if (error instanceof InvalidAmountError) {
        this.notifier.showNotification('error', error.message);
      }
    }
    return total;
  }
}
