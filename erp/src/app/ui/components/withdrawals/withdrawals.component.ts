import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { IPartner } from 'src/app/partners/domain/partner';
import { GetSales } from 'src/app/sales/application/get-sales.use-cases';
import { UpdateSales } from 'src/app/sales/application/update-sales.use-case';
import { ISales, ISalesDetails } from 'src/app/sales/domain/sales';
import { DatetimeHelperService } from 'src/app/shared/application/datetime.helper.service';
import { ErrorHandlerService } from 'src/app/shared/error/error-handler';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';

@Component({
  selector: 'app-withdrawals',
  templateUrl: './withdrawals.component.html',
  styleUrls: ['./withdrawals.component.scss'],
})
export class WithdrawalsComponent implements AfterViewInit {
  @Input('partner') partner!: IPartner;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) salesTable!: MatTable<ISales>;
  salesList: ISales[] = [];
  isLargeScreen = false;
  selectedRowIndex: string | null = null;
  dataSource!: MatTableDataSource<ISales>;
  tableHasChanged = false;
  emptyTable = true;

  activeSaleDetails: ISalesDetails[] = [];
  activeSaleCode = '';

  sale: ISales = {
    sale_id: '123',
    code: 'V-FFAACBA',
    partner_id: '123',
    created_at: '12/12/90',
    discount: 0,
    total_amount: 0,
    sale_details: [
      {
        sale_detail_id: '',
        sale_id: '123',
        product_id: '3423',
        product_name: 'Sour Diesel',
        product_code: 'P-AAABBFS',
        harvest_id: '123',
        harvest_code: 'C-EEEDFFA',
        quantity: 10,
        amount: 70,
      },
      {
        sale_detail_id: '',
        sale_id: '123',
        product_id: '3423',
        product_name: 'Critical',
        product_code: 'P-AAAOOFS',
        harvest_id: '123',
        harvest_code: 'C-EELKKE',
        quantity: 30,
        amount: 120,
      },
      {
        sale_detail_id: '',
        sale_id: '123',
        product_id: '3423',
        product_name: 'Green Poison',
        product_code: 'P-AEEBBFS',
        harvest_id: '123',
        harvest_code: 'C-EAABBE',
        quantity: 30,
        amount: 120,
      },
      {
        sale_detail_id: '',
        sale_id: '123',
        product_id: '3423',
        product_name: '1906',
        product_code: 'P-AELLBFS',
        harvest_id: '',
        harvest_code: '',
        quantity: 3,
        amount: 8,
      },
      {
        sale_detail_id: '',
        sale_id: '123',
        product_id: '3423',
        product_name: 'Coca-Cola',
        product_code: 'P-AELLBFS',
        harvest_id: '',
        harvest_code: '',
        quantity: 2,
        amount: 3,
      },
    ],
  };
  sale1: ISales = {
    sale_id: '000',
    code: 'V-FFAACBA',
    partner_id: '123',
    created_at: '12/12/90',
    discount: 0,
    total_amount: 0,
    sale_details: [
      {
        sale_detail_id: '',
        sale_id: '123',
        product_id: '3423',
        product_name: 'Sour Diesel',
        product_code: 'P-AAABBFS',
        harvest_id: '123',
        harvest_code: 'C-EEEDFFA',
        quantity: 10,
        amount: 70,
      },
      {
        sale_detail_id: '',
        sale_id: '123',
        product_id: '3423',
        product_name: 'Critical',
        product_code: 'P-AAAOOFS',
        harvest_id: '123',
        harvest_code: 'C-EELKKE',
        quantity: 30,
        amount: 120,
      },
      {
        sale_detail_id: '',
        sale_id: '123',
        product_id: '3423',
        product_name: 'Green Poison',
        product_code: 'P-AEEBBFS',
        harvest_id: '123',
        harvest_code: 'C-EAABBE',
        quantity: 30,
        amount: 120,
      },
      {
        sale_detail_id: '',
        sale_id: '123',
        product_id: '3423',
        product_name: '1906',
        product_code: 'P-AELLBFS',
        harvest_id: '',
        harvest_code: '',
        quantity: 3,
        amount: 8,
      },
      {
        sale_detail_id: '',
        sale_id: '123',
        product_id: '3423',
        product_name: 'Coca-Cola',
        product_code: 'P-AELLBFS',
        harvest_id: '',
        harvest_code: '',
        quantity: 2,
        amount: 3,
      },
    ],
  };

  displayedColumns: string[] = [
    'sale_id',
    'code',
    'created_at',
    'discount',
    'total_amount',
    'actions',
  ];
  columnDefinitions = [
    { def: 'sale_id', show: false },
    { def: 'code', show: true },
    { def: 'created_at', show: true },
    { def: 'discount', show: true },
    { def: 'total_amount', show: true },
    { def: 'actions', show: true },
  ];

  private destroy$ = new Subject();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private notifier: NotificationAdapter,
    private errorHandler: ErrorHandlerService,
    private getService: GetSales,
    private updateService: UpdateSales
  ) {
    this.salesList.push(this.sale);
    this.salesList.push(this.sale1);
    this.dataSource = new MatTableDataSource(this.salesList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngAfterViewInit(): void {
    this.renderTable();
  }

  ngOnInit(): void {
    // this.getSales();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getSales(): void {
    // this.getService
    //   .getAllPartnerSales(this.partner.partner_id!)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: (sales: ISales[]) => {
    //       const list = sales;
    //       list.length ? (this.emptyTable = false) : (this.emptyTable = true);
    //       this.salesList = list;
    //       this.renderTable();
    //       this.tableHasChanged = false;
    //     },
    //     error: (error: any) => {
    //       if (error.statusCode) {
    //         if (
    //           error.statusCode === 404 &&
    //           error.message === 'No hay retiradas registradas'
    //         ) {
    //           this.salesList = [];
    //           this.renderTable();
    //         }
    //       }
    //     },
    //   });
  }
  openEditDetaislDialog(sale: ISales) {}

  /************************* Gestión de tabla ************************************/

  private renderTable() {
    this.dataSource = new MatTableDataSource(this.salesList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.salesTable.renderRows();
  }

  // Esconde el paginator en pantallas pequeñas
  breakPointObserver(): void {
    this.breakpointObserver
      .observe(['(min-width: 500px)'])
      .subscribe((result) => (this.isLargeScreen = result.matches));
  }

  getFormattedDate(d: any): string {
    return DatetimeHelperService.fromDatePickerDate(d);
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

  selectRow(row: ISales) {
    this.selectedRowIndex = row.sale_id;
    this.activeSaleDetails = row.sale_details;
    this.activeSaleCode = row.code!;
  }

  deleteSale(sale: ISales) {
    this.updateService
      .delete(sale.sale_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res.affectedRows > 0) {
            this.notifier.showNotification('success', 'Retirada eliminada');
          } else {
            this.errorHandler.handleUnkonwError(res);
          }
        },
        error: (error: any) => {
          console.error(error);
        },
      });
  }
}
