import { BreakpointObserver } from '@angular/cdk/layout';
import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { NotificationAdapter } from '../../../shared/infraestructure/notifier.adapter';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { FeesVariants, IFees } from 'src/app/partners/domain/fees';
import { FeesUseCases } from 'src/app/partners/application/fees.use-case';
import { IPartner } from 'src/app/partners/domain/partner';
import { DatetimeHelperService } from 'src/app/shared/application/datetime.helper.service';
import { Router } from '@angular/router';
import { PageRoutes } from '../../pages/pages-info.config';
import { ActiveEntityService } from '../../services/active-entity-service.service';

const modalOptions: NgbModalOptions = {
  backdrop: 'static',
  keyboard: false,
};

@Component({
  selector: 'app-fees-history',
  templateUrl: './fees-history.component.html',
  styleUrls: ['./fees-history.component.scss'],
})
export class FeesHistoryComponent implements AfterViewInit {
  @Input('fees') fees: IFees[] = [];
  @Input('partner') partner!: IPartner;
  dataSource!: MatTableDataSource<IFees>;
  tableHasChanged = false;
  emptyTable = true;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  @ViewChild(MatTable) feesListTable!: MatTable<IFees>;
  displayedColumns: string[] = [
    'fee_id',
    'fees_type_id',
    'expiration',
    'paid',
    'created_at',
    'actions',
  ];
  columnDefinitions = [
    { def: 'created_at', show: true },
    { def: 'fee_id', show: false },
    { def: 'fees_type_id', show: true },
    { def: 'expiration', show: true },
    { def: 'paid', show: true },
    { def: 'actions', show: true },
  ];
  isLargeScreen = false;
  selectedRowIndex: number | null = null;

  private destroy$ = new Subject();

  isLoading: boolean = true;

  constructor(
    public modal: NgbActiveModal,
    private feesService: FeesUseCases,
    private breakpointObserver: BreakpointObserver,
    private activeEntityService: ActiveEntityService,
    private router: Router,
    private notifier: NotificationAdapter
  ) {
    this.dataSource = new MatTableDataSource(this.fees);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngAfterViewInit(): void {
    this.fees = this.getNonExentFees(this.fees);
    this.renderTable();
  }

  openDetails(entity: IFees, id: string) {
    if (!entity.paid) {
      this.notifier.showNotification(
        'warning',
        'La entrada seleccionada todavía no ha sido abonada'
      );
      return;
    }
    this.activeEntityService.setActiveEntity(entity, id);
    this.modal.close();
    this.router.navigateByUrl(PageRoutes.TRANSACTIONS_DETAILS);
  }

  getNonExentAndPaidFees(fees: IFees[]): IFees[] {
    const feesNonExentAndPaid = fees.filter((fee) => {
      return (
        fee.fees_type_id !== FeesVariants.CUOTA_EXENTA &&
        fee.fees_type_id !== FeesVariants.INSCRIPCION_EXENTA &&
        fee.paid
      );
    });
    return feesNonExentAndPaid;
  }

  getNonExentFees(fees: IFees[]): IFees[] {
    const feesNonExentAndPaid = fees.filter((fee) => {
      return (
        fee.fees_type_id !== FeesVariants.CUOTA_EXENTA &&
        fee.fees_type_id !== FeesVariants.INSCRIPCION_EXENTA
      );
    });
    return feesNonExentAndPaid;
  }

  getFeesType(feesType: FeesVariants) {
    return this.feesService.getFeesTypeString(feesType);
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
    this.dataSource = new MatTableDataSource(this.fees);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.feesListTable.renderRows();
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

  selectRow(row: IFees) {
    this.selectedRowIndex = row.fee_id!;
  }
}
