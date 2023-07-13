import { BreakpointObserver } from '@angular/cdk/layout';
import {
  AfterViewInit,
  Component,
  Input,
  ViewChild,
  OnInit,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { IPartner } from 'src/app/partners/domain/partner';
import { DatetimeHelperService } from 'src/app/shared/application/datetime.helper.service';
import { GetTransactions } from 'src/app/transactions/application/get-transactions.use-cases';
import { ITransactions } from 'src/app/transactions/domain/transactions';
import { ActiveEntityService } from '../../services/active-entity-service.service';
import { Router } from '@angular/router';
import { PageRoutes } from '../../pages/pages-info.config';

@Component({
  selector: 'app-partner-account-history',
  templateUrl: './partner-account-history.component.html',
  styleUrls: ['./partner-account-history.component.scss'],
})
export class PartnerAccountHistoryComponent {
  @Input('partner') partner!: IPartner;
  transactions: ITransactions[] = [];
  dataSource!: MatTableDataSource<ITransactions>;
  tableHasChanged = false;
  emptyTable = true;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  @ViewChild(MatTable) transactionsListTable!: MatTable<ITransactions>;
  displayedColumns: string[] = [
    'transaction_id',
    'code',
    'transaction_type_id',
    'created_at',
    'amount',
    'actions',
  ];
  columnDefinitions = [
    { def: 'created_at', show: true },
    { def: 'code', show: true },
    { def: 'transaction_id', show: false },
    { def: 'transaction_type_id', show: true },
    { def: 'amount', show: true },
    { def: 'actions', show: true },
  ];
  isLargeScreen = false;
  selectedRowIndex: number | null = null;

  private destroy$ = new Subject();

  isLoading: boolean = true;

  constructor(
    public modal: NgbActiveModal,
    private transactionsService: GetTransactions,
    private breakpointObserver: BreakpointObserver,
    private activeEntityService: ActiveEntityService,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource(this.transactions);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getTransactions();
  }

  openDetails(entity: ITransactions, id: string) {
    this.activeEntityService.setActiveEntity(entity, id);
    this.modal.close();
    this.router.navigateByUrl(PageRoutes.TRANSACTIONS_DETAILS);
  }

  getTransactions() {
    this.transactionsService
      .getPartnerAccountTransactions(this.partner.partner_id!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (transactionsList: ITransactions[]) => {
          this.transactions = transactionsList;
          setTimeout(() => {
            this.renderTable();
          });
        },
      });
  }

  getFormattedDate(d: any): string {
    return DatetimeHelperService.fromDatePickerDate(d);
  }

  // Esconde el paginator en pantallas pequeñas
  breakPointObserver(): void {
    this.breakpointObserver
      .observe(['(min-width: 500px)'])
      .subscribe((result) => (this.isLargeScreen = result.matches));
  }

  private renderTable() {
    this.dataSource = new MatTableDataSource(this.transactions);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.transactionsListTable.renderRows();
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

  selectRow(row: ITransactions) {
    this.selectedRowIndex = Number(row.transaction_id!);
  }
}
