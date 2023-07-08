import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { ProductsType } from 'src/app/products/domain/products';
import { GetProviders } from 'src/app/providers/application/get-providers.use-cases';
import { UpdateProviders } from 'src/app/providers/application/update-providers.use-case';
import { IProvider } from 'src/app/providers/domain/providers';
import { DatetimeHelperService } from 'src/app/shared/application/datetime.helper.service';
import { ErrorHandlerService } from 'src/app/shared/error/error-handler';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import { ActiveEntityService } from 'src/app/ui/services/active-entity-service.service';
import { ConfirmDialogComponent } from 'src/app/ui/shared/components/confirm-dialog/confirm-dialog.component';
import { CreateProviderComponent } from '../create-provider/create-provider.component';
import { EditProviderComponent } from '../edit-provider/edit-provider.component';
import { Router } from '@angular/router';
import { PageRoutes } from '../../pages-info.config';

const modalOptions: NgbModalOptions = {
  backdrop: 'static',
  keyboard: false,
};

@Component({
  selector: 'app-list-provider',
  templateUrl: './list-provider.component.html',
  styleUrls: ['./list-provider.component.scss'],
})
export class ListProviderComponent {
  providerList: IProvider[] = [];
  dataSource!: MatTableDataSource<IProvider>;
  tableHasChanged = false;
  emptyTable = true;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  @ViewChild(MatTable)
  providerListTable!: MatTable<IProvider>;
  displayedColumns: string[] = [
    'name',
    'cultivator_id',
    'email',
    'phone',
    'created_at',
    'actions',
  ];
  columnDefinitions = [
    { def: 'provider_id', show: false },
    { def: 'created_at', show: true },
    { def: 'name', show: true },
    { def: 'email', show: true },
    { def: 'phone', show: true },
    { def: 'actions', show: true },
  ];
  isLargeScreen = false;
  selectedRowIndex: string | null = null;

  private destroy$ = new Subject();

  isLoading: boolean = true;

  constructor(
    private modalService: NgbModal,
    private breakpointObserver: BreakpointObserver,
    private notifier: NotificationAdapter,
    private errorHandler: ErrorHandlerService,
    private activeEntityService: ActiveEntityService,
    private updateService: UpdateProviders,
    private getService: GetProviders,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource(this.providerList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getProviders();
  }

  ngOnDestroy(): void {
    // this.activeEntityService.clearActiveEntity();
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  openDetails(entity: IProvider, id: string) {
    this.activeEntityService.setActiveEntity(entity, id);
    this.router.navigateByUrl(PageRoutes.PROVIDERS_DETAILS);
  }

  getProviders(): void {
    this.getService
      .getAll(ProductsType.TERCEROS)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (providers: IProvider[]) => {
          const list = providers;
          list.length ? (this.emptyTable = false) : (this.emptyTable = true);
          this.providerList = list;
          this.renderTable();
          this.tableHasChanged = false;
          this.isLoading = false;
        },
        error: (error: any) => {
          if (error.statusCode) {
            if (
              error.statusCode === 404 &&
              error.message === 'No hay proveedores/cultivadores registrados'
            ) {
              this.providerList = [];
              this.renderTable();
            }
          }
        },
      });
  }

  deleteProvider(id: string): void {
    this.updateService
      .delete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res.affectedRows > 0) {
            this.notifier.showNotification('success', 'Proveedor eliminado');
            this.tableHasChanged = true;
            this.getProviders();
          } else {
            this.errorHandler.handleUnkonwError(res);
          }
        },
      });
  }

  openConfirmDialog(id: string): void {
    const modalRef = this.modalService.open(ConfirmDialogComponent);
    modalRef.componentInstance.message =
      'ATENCIÓN: El proveedor será eliminado. Si el proveedor está vinculado a alguna/s compra/s, será necesario eliminarla/s primero.';
    modalRef.result
      .then((result: any) => {
        if (result) {
          console.log(id);
          this.deleteProvider(id!);
        }
      })
      .catch((error: any) => {
        if (error) console.error(error);
      });
  }

  openCreateProviderDialog() {
    const modalRef = this.modalService.open(
      CreateProviderComponent,
      modalOptions
    );
    modalRef.result
      .then((result: any) => {
        if (result) {
          this.getProviders();
          this.activeEntityService.clearActiveEntity();
        }
      })
      .catch((error: any) => {
        if (error) console.error(error);
      });
  }

  openEditProviderDialog(cultivator: IProvider, uid: string) {
    this.activeEntityService.setActiveEntity(cultivator, uid);
    const modalRef = this.modalService.open(
      EditProviderComponent,
      modalOptions
    );
    modalRef.componentInstance.uid = uid;
    modalRef.result
      .then((result: any) => {
        if (result) {
          this.getProviders();
          this.activeEntityService.clearActiveEntity();
        }
      })
      .catch((error: any) => {
        if (error) console.error(error);
      });
  }

  private renderTable() {
    this.dataSource = new MatTableDataSource(this.providerList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.providerListTable.renderRows();
  }

  getFormattedDate(d: any): string {
    return DatetimeHelperService.fromDatePickerDate(d);
  }

  /************************* Gestión de tabla ************************************/

  // Esconde el paginator en pantallas pequeñas
  breakPointObserver(): void {
    this.breakpointObserver
      .observe(['(min-width: 500px)'])
      .subscribe(
        (result: { matches: boolean }) => (this.isLargeScreen = result.matches)
      );
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
