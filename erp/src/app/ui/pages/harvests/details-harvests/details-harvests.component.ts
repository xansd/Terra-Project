import { Component } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { GetHarvests } from 'src/app/purchases/application/get-harvests.use-cases';
import { IHarvests } from 'src/app/purchases/domain/harvests';
import { DatetimeHelperService } from 'src/app/shared/application/datetime.helper.service';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import searchConfig, {
  HarvestSearchTypes,
} from 'src/app/ui/components/searcher/search.config';
import { ActiveEntityService } from 'src/app/ui/services/active-entity-service.service';
import { CreateHarvestComponent } from '../create-harvest/create-harvest.component';
import { IPayments } from 'src/app/payments/domain/payments';
import { GetPayments } from 'src/app/payments/application/get-payments.use-cases';
import { InvalidAmountError } from 'src/app/payments/domain/payments.exception';
import { MakePaymentComponent } from 'src/app/ui/components/make-payment/make-payment.component';
import { ConfirmDialogComponent } from 'src/app/ui/shared/components/confirm-dialog/confirm-dialog.component';
import { UpdatePayments } from 'src/app/payments/application/update-payments.use-case';
import {
  StockType,
  UpdateStockComponent,
} from 'src/app/ui/components/update-stock/update-stock.component';
import { UpdateManicuredComponent } from 'src/app/ui/components/update-manicured/update-manicured.component';
import { UpdateHarvesFeeComponent } from 'src/app/ui/components/update-harves-fee/update-harves-fee.component';
import { UpdateHarvestLossComponent } from 'src/app/ui/components/update-harvest-loss/update-harvest-loss.component';

const modalOptions: NgbModalOptions = {
  backdrop: 'static',
  keyboard: false,
};
@Component({
  selector: 'app-details-harvests',
  templateUrl: './details-harvests.component.html',
  styleUrls: ['./details-harvests.component.scss'],
})
export class DetailsHarvestsComponent {
  id!: string;
  harvest!: IHarvests | undefined;
  finalStock = 0;
  salePrice = 0;
  payments: IPayments[] = [];
  options: IHarvests[] = [];
  searchTypes: { label: string; value: HarvestSearchTypes }[] =
    searchConfig.HARVEST_TYPES;

  private destroy$ = new Subject();
  isLoading: boolean = true;
  selectInProgress = false;
  hidden = true;

  constructor(
    private harvestService: GetHarvests,
    private modalService: NgbModal,
    private activeEntityService: ActiveEntityService,
    private notifier: NotificationAdapter,
    private getPaymentsService: GetPayments,
    private deletePaymentService: UpdatePayments
  ) {}

  ngOnInit(): void {
    // Carga el buscador
    this.getHarvestList();
    this.getActiveEntityId();
    if (this.id) this.getHarvest();
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

  getHarvestList() {
    this.harvestService
      .getAllHarvests()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (harvestList: IHarvests[]) => {
          this.options = harvestList;
          if (harvestList.length > 0) {
            const lastID = this.getLastHarvest(harvestList);
            if (lastID && !this.id) {
              this.id = lastID;
              this.getHarvest();
            }
          } else {
            this.isLoading = true;
            this.harvest = undefined;
          }
        },
      });
  }

  getLastHarvest(harvestList: IHarvests[]): string | undefined {
    if (harvestList && harvestList.length > 0) {
      const lastHarvest = harvestList[harvestList.length - 1];
      const lastHarvestId = lastHarvest!.harvest_id;
      return lastHarvestId;
    }
    return undefined;
  }

  handleOptionSelected(option: any): void {
    if (!this.selectInProgress) {
      this.selectInProgress = true;
      this.id = option.harvest_id;
      this.getHarvest();

      setTimeout(() => {
        this.selectInProgress = false;
      }, 100);
    }
  }

  /*********************************BUSCADOR************************************/

  /*************************************CARGA CULTIVO**************************************/

  getHarvest() {
    if (!this.checkHarvestSelected()) return;
    this.harvestService
      .getHarvestById(this.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (harvest: IHarvests) => {
          this.id = harvest.harvest_id!;
          this.getFinalStock(harvest);
          this.getSalePrice(harvest);
          this.harvest = harvest;
          // this.activeEntityService.setActiveEntity(this.harvest, this.id);
          this.getPayments();
          this.isLoading = false;
        },
      });
  }

  getPayments() {
    if (!this.checkHarvestSelected()) return;
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
    if (!this.checkHarvestSelected()) return;
    this.deletePaymentService
      .delete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res.affectedRows > 0) {
            this.notifier.showNotification('success', 'Pago eliminado');
            this.getHarvest();
          }
        },
      });
  }

  getPendingPayment() {
    if (!this.checkHarvestSelected()) return;
  }

  checkHarvestSelected(): boolean {
    if (!this.id) {
      this.notifier.showNotification('warning', 'Elige un cultivo primero');
      return false;
    }
    return true;
  }

  formatDate(date: string): string {
    return DatetimeHelperService.dateToView(date);
  }

  openCreateHarvestDialog() {
    const modalRef = this.modalService.open(
      CreateHarvestComponent,
      modalOptions
    );
    modalRef.result
      .then((result) => {
        if (result) {
          this.id = '';
          this.getHarvestList();
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

  openUpdateStockHarvestDialog() {
    const modalRef = this.modalService.open(UpdateStockComponent, modalOptions);
    modalRef.componentInstance.id = this.id;
    modalRef.componentInstance.type = StockType.HARVEST;
    modalRef.result
      .then((result) => {
        if (result) {
          this.getHarvest();
        }
      })
      .catch((error) => {
        if (error) console.error(error);
      });
  }

  openUpdateFeeHarvestDialog() {
    const modalRef = this.modalService.open(
      UpdateHarvesFeeComponent,
      modalOptions
    );
    modalRef.componentInstance.id = this.id;
    modalRef.result
      .then((result) => {
        if (result) {
          this.getHarvest();
        }
      })
      .catch((error) => {
        if (error) console.error(error);
      });
  }

  openUpdateManicuredHarvestDialog() {
    const modalRef = this.modalService.open(
      UpdateManicuredComponent,
      modalOptions
    );
    modalRef.componentInstance.id = this.id;
    modalRef.result
      .then((result) => {
        if (result) {
          this.getHarvest();
        }
      })
      .catch((error) => {
        if (error) console.error(error);
      });
  }

  openUpdateAdjustHarvestDialog() {
    const modalRef = this.modalService.open(
      UpdateHarvestLossComponent,
      modalOptions
    );
    modalRef.componentInstance.id = this.id;
    modalRef.result
      .then((result) => {
        if (result) {
          this.getHarvest();
        }
      })
      .catch((error) => {
        if (error) console.error(error);
      });
  }

  openMakePaymentDialog(harvest: IHarvests, payments: IPayments[]) {
    const modalRef = this.modalService.open(MakePaymentComponent, modalOptions);
    modalRef.componentInstance.id = harvest.harvest_id;
    modalRef.componentInstance.pending = this.getTotalPending(
      harvest,
      payments
    );
    modalRef.result
      .then((result) => {
        if (result) {
          this.getHarvest();
        }
      })
      .catch((error) => {
        if (error) console.error(error);
      });
  }

  getTotal(harvest: IHarvests): number {
    let total = 0;
    try {
      total = this.getPaymentsService.getHarvestTotalPayment(harvest);
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

  getTotalPending(harvest: IHarvests, payments: IPayments[]) {
    let total = 0;
    try {
      total = this.getPaymentsService.getTotalHarvestPending(harvest, payments);
    } catch (error) {
      if (error instanceof InvalidAmountError) {
        this.notifier.showNotification('error', error.message);
      }
    }
    return total;
  }

  getSalePrice(harvest: IHarvests) {
    let result = 0;
    try {
      result = this.harvestService.getHarvestSalePrice(harvest);
    } catch (error) {
      if (error instanceof InvalidAmountError) {
        this.notifier.showNotification('error', error.message);
      }
    }
    this.salePrice = result;
  }

  getFinalStock(harvest: IHarvests): void {
    let result = 0;
    try {
      result = this.harvestService.getHarvestFinalStock(harvest);
    } catch (error) {
      if (error instanceof InvalidAmountError) {
        this.notifier.showNotification('error', error.message);
      }
    }
    this.finalStock = result;
  }
}
