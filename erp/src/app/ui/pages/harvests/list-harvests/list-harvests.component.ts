import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { IHarvests } from 'src/app/purchases/domain/harvests';
import { DatetimeHelperService } from 'src/app/shared/application/datetime.helper.service';
import { ErrorHandlerService } from 'src/app/shared/error/error-handler';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import { ActiveEntityService } from 'src/app/ui/services/active-entity-service.service';
import { ConfirmDialogComponent } from 'src/app/ui/shared/components/confirm-dialog/confirm-dialog.component';
import { PageRoutes } from '../../pages-info.config';
import { CreateVarietiesComponent } from '../../varieties/create-varieties/create-varieties.component';
import { EditVarietiesComponent } from '../../varieties/edit-varieties/edit-varieties.component';
import { UpdateHarvests } from 'src/app/purchases/application/update-harvests.use-case';
import { GetHarvests } from 'src/app/purchases/application/get-harvests.use-cases';
import { CreateHarvestComponent } from '../create-harvest/create-harvest.component';
import { GetPayments } from 'src/app/payments/application/get-payments.use-cases';

const modalOptions: NgbModalOptions = {
  backdrop: 'static',
  keyboard: false,
};
@Component({
  selector: 'app-list-harvests',
  templateUrl: './list-harvests.component.html',
  styleUrls: ['./list-harvests.component.scss'],
})
export class ListHarvestsComponent {
  harvestsList: IHarvests[] = [];
  dataSource!: MatTableDataSource<IHarvests>;
  tableHasChanged = false;
  emptyTable = true;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  @ViewChild(MatTable)
  harvestsListTable!: MatTable<IHarvests>;
  displayedColumns: string[] = [
    'harvest_id',
    'code',
    'provider_id',
    'provider_name',
    'product_id',
    'product_name',
    'stock',
    'created_at',
    'total_cost',
    'pending',
    'actions',
  ];
  columnDefinitions = [
    { def: 'harvest_id', show: false },
    { def: 'code', show: true },
    { def: 'created_at', show: true },
    { def: 'provider_id', show: false },
    { def: 'provider_name', show: true },
    { def: 'product_id', show: false },
    { def: 'product_name', show: true },
    { def: 'total_cost', show: true },
    { def: 'pending', show: true },
    { def: 'stock', show: true },
    { def: 'actions', show: true },
  ];
  isLargeScreen = false;
  selectedRowIndex: string | null = null;

  private destroy$ = new Subject();

  isLoading: boolean = true;

  constructor(
    private modalService: NgbModal,
    private breakpointObserver: BreakpointObserver,
    private deleteService: UpdateHarvests,
    private getService: GetHarvests,
    private paymentsService: GetPayments,
    private notifier: NotificationAdapter,
    private errorHandler: ErrorHandlerService,
    private activeEntityService: ActiveEntityService,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource(this.harvestsList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getHarvests();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getHarvests(): void {
    this.getService
      .getAllHarvests()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (harvests: IHarvests[]) => {
          const list = harvests.map((harvest: IHarvests) => {
            const pending = this.getPending(harvest);
            const total_cost = this.getCost(harvest);
            const stock = this.getFinalStock(harvest);
            return {
              ...harvest,
              pending,
              total_cost,
              stock,
            };
          });
          list.length ? (this.emptyTable = false) : (this.emptyTable = true);
          this.harvestsList = list;
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
              this.harvestsList = [];
              this.renderTable();
            }
          }
        },
      });
  }

  deleteHarvest(id: string): void {
    this.deleteService
      .deleteHarvest(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res.affectedRows > 0) {
            this.notifier.showNotification('success', 'Cultivo eliminado');
            this.tableHasChanged = true;
            this.getHarvests();
          } else {
            this.errorHandler.handleUnkonwError(res);
          }
        },
      });
  }

  openConfirmDialog(id: string): void {
    const modalRef = this.modalService.open(ConfirmDialogComponent);
    modalRef.componentInstance.message = 'El cultivo será eliminado.';
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

  openCreateHarvestsDialog() {
    const modalRef = this.modalService.open(
      CreateHarvestComponent,
      modalOptions
    );
    modalRef.result
      .then((result) => {
        if (result) {
          this.getHarvests();
          this.activeEntityService.clearActiveEntity();
        }
      })
      .catch((error) => {
        if (error) console.error(error);
      });
  }

  openEditHarvestsDialog(harvest: IHarvests, uid: string) {
    this.activeEntityService.setActiveEntity(harvest, uid);
    const modalRef = this.modalService.open(
      EditVarietiesComponent,
      modalOptions
    );
    modalRef.componentInstance.uid = uid;
    modalRef.result
      .then((result) => {
        if (result) {
          this.getHarvests();
          this.activeEntityService.clearActiveEntity();
        }
      })
      .catch((error) => {
        if (error) console.error(error);
      });
  }

  openDetails(entity: IHarvests, id: string) {
    this.activeEntityService.setActiveEntity(entity, id);
    this.router.navigateByUrl(PageRoutes.HARVESTS_DETAILS);
  }

  private renderTable() {
    this.dataSource = new MatTableDataSource(this.harvestsList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.harvestsListTable.renderRows();
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

  getFinalStock(harvest: IHarvests): number {
    let result = 0;
    try {
      result = this.getService.getHarvestFinalStock(harvest);
    } catch (error) {
      this.notifier.showNotification(
        'error',
        'Ha ocurrido un error al calcular el stock del cultivo'
      );
    }
    return result;
  }

  getCost(harvest: IHarvests): number {
    let result = 0;
    try {
      result = this.getService.getHarvestFinalCost(harvest);
    } catch (error) {
      this.notifier.showNotification(
        'error',
        'Ha ocurrido un error al calcular el coste del cultivo'
      );
    }
    return result;
  }

  getPending(harvest: IHarvests): number {
    let result = 0;
    try {
      result = this.paymentsService.getTotalHarvestPending(harvest);
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
