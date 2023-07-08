import { Component, ViewChild } from '@angular/core';
import { GetPurchases } from 'src/app/purchases/application/get-purchases.use-cases';
import { UpdatePurchases } from 'src/app/purchases/application/update-purchases.use-case';
import { IPurchase } from 'src/app/purchases/domain/purchases';
import { CreatePurchaseComponent } from '../create-purchase/create-purchase.component';
import { EditPurchaseComponent } from '../edit-purchase/edit-purchase.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { GetPayments } from 'src/app/payments/application/get-payments.use-cases';
import { DatetimeHelperService } from 'src/app/shared/application/datetime.helper.service';
import { ErrorHandlerService } from 'src/app/shared/error/error-handler';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import { ActiveEntityService } from 'src/app/ui/services/active-entity-service.service';
import { ConfirmDialogComponent } from 'src/app/ui/shared/components/confirm-dialog/confirm-dialog.component';
import { PageRoutes } from '../../pages-info.config';

const modalOptions: NgbModalOptions = {
  backdrop: 'static',
  keyboard: false,
  size: 'xl',
};

@Component({
  selector: 'app-list-purchases',
  templateUrl: './list-purchases.component.html',
  styleUrls: ['./list-purchases.component.scss'],
})
export class ListPurchasesComponent {
  purchasesList: IPurchase[] = [];
  dataSource!: MatTableDataSource<IPurchase>;
  tableHasChanged = false;
  emptyTable = true;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  @ViewChild(MatTable)
  purchasesListTable!: MatTable<IPurchase>;
  displayedColumns: string[] = [
    'purchase_id',
    'code',
    'provider_id',
    'provider_name',
    'created_at',
    'total_amount',
    'pending',
    'actions',
  ];
  columnDefinitions = [
    { def: 'purchase_id', show: false },
    { def: 'code', show: true },
    { def: 'created_at', show: true },
    { def: 'provider_id', show: false },
    { def: 'provider_name', show: true },
    { def: 'total_amount', show: true },
    { def: 'pending', show: true },
    { def: 'actions', show: true },
  ];
  isLargeScreen = false;
  selectedRowIndex: string | null = null;

  private destroy$ = new Subject();

  isLoading: boolean = true;

  constructor(
    private modalService: NgbModal,
    private breakpointObserver: BreakpointObserver,
    private deleteService: UpdatePurchases,
    private getService: GetPurchases,
    private paymentsService: GetPayments,
    private notifier: NotificationAdapter,
    private errorHandler: ErrorHandlerService,
    private activeEntityService: ActiveEntityService,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource(this.purchasesList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getPurchases();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getPurchases(): void {
    this.getService
      .getAllPurchases()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (purchases: IPurchase[]) => {
          const list = purchases.map((purchase: IPurchase) => {
            const pending = this.getPending(purchase);
            return {
              ...purchase,
              pending,
            };
          });
          list.length ? (this.emptyTable = false) : (this.emptyTable = true);
          this.purchasesList = list;
          this.renderTable();
          this.tableHasChanged = false;
          this.isLoading = false;
        },
        error: (error: any) => {
          if (error.statusCode) {
            if (
              error.statusCode === 404 &&
              error.message === 'No hay cultivos/compras registrados'
            ) {
              this.purchasesList = [];
              this.renderTable();
            }
          }
        },
      });
  }

  deleteHarvest(id: string): void {
    this.deleteService
      .deletePurchase(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res.affectedRows > 0) {
            this.notifier.showNotification('success', 'Compra eliminada');
            this.tableHasChanged = true;
            this.getPurchases();
          } else {
            this.errorHandler.handleUnkonwError(res);
          }
        },
      });
  }

  openConfirmDialog(id: string): void {
    const modalRef = this.modalService.open(ConfirmDialogComponent);
    modalRef.componentInstance.message =
      'Atención: La compra será eliminada junto con el stock asociado a sus productos.';
    modalRef.result
      .then((result) => {
        if (result) {
          this.deleteHarvest(id!);
        }
      })
      .catch((error) => {
        if (error) console.error(error);
      });
  }

  openCreatePurchasesDialog() {
    const modalRef = this.modalService.open(
      CreatePurchaseComponent,
      modalOptions
    );
    modalRef.result
      .then((result) => {
        if (result) {
          this.getPurchases();
          this.activeEntityService.clearActiveEntity();
        }
      })
      .catch((error) => {
        if (error) console.error(error);
      });
  }

  openEditHarvestsDialog(harvest: IPurchase, uid: string) {
    this.activeEntityService.setActiveEntity(harvest, uid);
    const modalRef = this.modalService.open(
      EditPurchaseComponent,
      modalOptions
    );
    modalRef.componentInstance.uid = uid;
    modalRef.result
      .then((result) => {
        if (result) {
          this.getPurchases();
          this.activeEntityService.clearActiveEntity();
        }
      })
      .catch((error) => {
        if (error) console.error(error);
      });
  }

  openDetails(entity: IPurchase, id: string) {
    this.activeEntityService.setActiveEntity(entity, id);
    this.router.navigateByUrl(PageRoutes.PURCHASES_DETAILS);
  }

  private renderTable() {
    this.dataSource = new MatTableDataSource(this.purchasesList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.purchasesListTable.renderRows();
  }

  getFormattedDate(d: any): string {
    return DatetimeHelperService.fromDatePickerDate(d);
  }

  /************************* Gestión de tabla ************************************/

  // Esconde el paginator en pantallas pequeñas
  breakPointObserver(): void {
    this.breakpointObserver
      .observe(['(min-width: 500px)'])
      .subscribe((result) => (this.isLargeScreen = result.matches));
  }

  getPending(purchase: IPurchase): number {
    let result = 0;
    try {
      result = this.paymentsService.getTotalPurchasePending(purchase);
    } catch (error) {
      this.notifier.showNotification(
        'error',
        'Ha ocurrido un error al calcular el coste del cultivo'
      );
    }
    return result;
  }

  /**
   * Retorna las columnas a renderizar en al tabla según su valor 'show'
   * @returns {string[]}
   */
  getDisplayedColumns(): string[] {
    const cols = this.columnDefinitions
      .filter((cd) => cd.show)
      .map((cd) => cd.def);
    return cols;
  }

  /**
   * Filtrado en tabla
   * @param event
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  selectRow(rowId: string) {
    if (this.selectedRowIndex === rowId) {
      this.selectedRowIndex = null;
    } else this.selectedRowIndex = rowId;
  }
}
