import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { DeleteProductUseCase } from 'src/app/products/application/delete.use-cases';
import { GetProductsUseCase } from 'src/app/products/application/get.use-cases';
import { IProduct, ProductsType } from 'src/app/products/domain/products';
import { ErrorHandlerService } from 'src/app/shared/error/error-handler';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import { ActiveEntityService } from 'src/app/ui/services/active-entity-service.service';
import { ConfirmDialogComponent } from 'src/app/ui/shared/components/confirm-dialog/confirm-dialog.component';
import { CreateProductComponent } from '../create-product/create-product.component';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { DatetimeHelperService } from 'src/app/shared/application/datetime.helper.service';

const modalOptions: NgbModalOptions = {
  backdrop: 'static',
  keyboard: false,
  size: 'xl',
};

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss'],
})
export class ListProductsComponent implements OnDestroy, OnInit {
  productsList: IProduct[] = [];
  dataSource!: MatTableDataSource<IProduct>;
  tableHasChanged = false;
  emptyTable = true;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  @ViewChild(MatTable)
  productsListTable!: MatTable<IProduct>;
  displayedColumns: string[] = [
    'name',
    'product_id',
    'code',
    'active',
    'created_at',
    'stock',
    'actions',
  ];
  columnDefinitions = [
    { def: 'name', show: true },
    { def: 'product_id', show: false },
    { def: 'code', show: true },
    { def: 'active', show: true },
    { def: 'stock', show: true },
    { def: 'created_at', show: true },
    { def: 'actions', show: true },
  ];
  isLargeScreen = false;
  selectedRowIndex: string | null = null;

  private destroy$ = new Subject();

  isLoading: boolean = true;

  constructor(
    private modalService: NgbModal,
    private breakpointObserver: BreakpointObserver,
    private deleteService: DeleteProductUseCase,
    private getService: GetProductsUseCase,
    private notifier: NotificationAdapter,
    private errorHandler: ErrorHandlerService,
    private activeEntityService: ActiveEntityService
  ) {
    this.dataSource = new MatTableDataSource(this.productsList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getProducts();
  }

  ngOnDestroy(): void {
    this.activeEntityService.clearActiveEntity();
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getProducts(): void {
    this.getService
      .getAllProducts(ProductsType.TERCEROS)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products: IProduct[]) => {
          const list = products;
          list.length ? (this.emptyTable = false) : (this.emptyTable = true);
          this.productsList = list;
          this.renderTable();
          this.tableHasChanged = false;
          this.isLoading = false;
        },
        error: (error: any) => {
          if (error.statusCode) {
            if (
              error.statusCode === 404 &&
              error.message === 'No hay productos registrados'
            ) {
              this.productsList = [];
              this.renderTable();
            }
          }
        },
      });
  }

  deleteProduct(id: string): void {
    this.deleteService
      .deleteProduct(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res.affectedRows > 0) {
            this.notifier.showNotification('success', 'Producto eliminado');
            this.tableHasChanged = true;
            this.getProducts();
          } else {
            this.errorHandler.handleUnkonwError(res);
          }
        },
      });
  }

  openConfirmDialog(id: string): void {
    const modalRef = this.modalService.open(ConfirmDialogComponent);
    modalRef.componentInstance.message =
      'El producto será eliminado junto con sus ficheros.';
    modalRef.result
      .then((result) => {
        if (result) {
          this.deleteProduct(id!);
        }
      })
      .catch((error) => {
        if (error) console.error(error);
      });
  }

  openCreateProductDialog() {
    const modalRef = this.modalService.open(
      CreateProductComponent,
      modalOptions
    );
    modalRef.result
      .then((result) => {
        if (result) {
          this.getProducts();
          this.activeEntityService.clearActiveEntity();
        }
      })
      .catch((error) => {
        if (error) console.error(error);
      });
  }

  openEditProductDialog(product: IProduct, uid: string) {
    this.activeEntityService.setActiveEntity(product, uid);
    const modalRef = this.modalService.open(EditProductComponent, modalOptions);
    modalRef.componentInstance.uid = uid;
    modalRef.result
      .then((result) => {
        if (result) {
          this.getProducts();
          this.activeEntityService.clearActiveEntity();
        }
      })
      .catch((error) => {
        if (error) console.error(error);
      });
  }

  private renderTable() {
    this.dataSource = new MatTableDataSource(this.productsList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.productsListTable.renderRows();
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
