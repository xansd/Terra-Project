import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { GetPartnerUseCase } from 'src/app/partners/application/get-partners.use-case';
import { IPartner } from 'src/app/partners/domain/partner';
import { PartnerDTOMapper } from 'src/app/partners/infratructure/partner-dto.mapper';
import { IPartnerDTO } from 'src/app/partners/infratructure/partner.dto';

@Component({
  selector: 'app-list-partners',
  templateUrl: './list-partners.component.html',
  styleUrls: ['./list-partners.component.scss'],
})
export class ListPartnersComponent {
  partnerDTOMapper = new PartnerDTOMapper();
  partnersList: IPartnerDTO[] = [];
  dataSource!: MatTableDataSource<IPartnerDTO>;
  tableHasChanged = false;
  emptyTable = false;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  @ViewChild(MatTable)
  partnersListTable!: MatTable<IPartnerDTO>;
  displayedColumns: string[] = [
    'partner_id',
    'number',
    'name',
    'wallet',
    'fee',
    'registration',
    'leaves',
    'active',
    'cannabis',
    'hash',
    'extractions',
    'actions',
  ];
  columnDefinitions = [
    { def: 'partner_id', show: false },
    { def: 'number', show: true },
    { def: 'name', show: true },
    { def: 'wallet', show: true },
    { def: 'fee', show: true },
    { def: 'registration', show: true },
    { def: 'leaves', show: false },
    { def: 'active', show: true },
    { def: 'cannabis', show: true },
    { def: 'hash', show: true },
    { def: 'extractions', show: true },
    { def: 'actions', show: true },
  ];
  isLargeScreen = false;
  selectedRowIndex: string | null = null;

  private destroy$ = new Subject();

  constructor(
    private modalService: NgbModal,
    private partnersService: GetPartnerUseCase,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.getPartners();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  selectRow(rowId: string) {
    if (this.selectedRowIndex === rowId) {
      this.selectedRowIndex = null;
    } else this.selectedRowIndex = rowId;
  }

  /**
   * Retorna la lisata de usuarios
   */
  getPartners(): void {
    this.partnersService
      .getAllPartners()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (partners: IPartner[]) => {
          const list = this.partnerDTOMapper.toDTOList(partners);
          list.length ? (this.emptyTable = false) : (this.emptyTable = true);
          this.partnersList = list;
          this.dataSource = new MatTableDataSource(this.partnersList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          if (this.tableHasChanged) {
            this.partnersListTable.renderRows();
          }
          this.tableHasChanged = false;
        },
        error: (error: Error) => {
          console.error(error);
        },
      });
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
  openCreatePartnerDialog() {}
  openEditPartnerDialog(row: any) {}
}
