import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { GetPartnerUseCase } from 'src/app/partners/application/get-partners.use-case';
import { IPartner } from 'src/app/partners/domain/partner';
import { PartnerDTOMapper } from 'src/app/partners/infratructure/partner-dto.mapper';
import { CreatePartnerComponent } from '../create-partner/create-partner.component';
import { EditPartnerComponent } from '../edit-partner/edit-partner.component';
import { DeletePartnerUseCase } from 'src/app/partners/application/delete-user.case-use';
import { NotificationAdapter } from '../../../../shared/infraestructure/notifier.adapter';
import { ErrorHandlerService } from 'src/app/shared/error/error-handler';
import { ConfirmDialogComponent } from 'src/app/ui/shared/components/confirm-dialog/confirm-dialog.component';
import { DatetimeHelperService } from 'src/app/ui/shared/helpers/datetime.helper.service';

const modalOptions: NgbModalOptions = {
  backdrop: 'static',
  keyboard: false,
  size: 'xl',
};

@Component({
  selector: 'app-list-partners',
  templateUrl: './list-partners.component.html',
  styleUrls: ['./list-partners.component.scss'],
})
export class ListPartnersComponent {
  partnerDTOMapper = new PartnerDTOMapper();
  partnersList: IPartner[] = [];
  dataSource!: MatTableDataSource<IPartner>;
  tableHasChanged = false;
  emptyTable = true;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  @ViewChild(MatTable)
  partnersListTable!: MatTable<IPartner>;
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
    { def: 'cannabis', show: true },
    { def: 'hash', show: true },
    { def: 'extractions', show: true },
    { def: 'wallet', show: true },
    { def: 'fee', show: true },
    { def: 'leaves', show: false },
    { def: 'active', show: true },
    { def: 'registration', show: true },
    { def: 'actions', show: true },
  ];
  isLargeScreen = false;
  selectedRowIndex: string | null = null;

  private destroy$ = new Subject();

  constructor(
    private modalService: NgbModal,
    private partnersService: GetPartnerUseCase,
    private breakpointObserver: BreakpointObserver,
    private deleteService: DeletePartnerUseCase,
    private notifier: NotificationAdapter,
    private errorHandler: ErrorHandlerService,
    private dateFormatter: DatetimeHelperService
  ) {
    this.dataSource = new MatTableDataSource(this.partnersList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getPartners();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
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
          const list = partners;
          list.length ? (this.emptyTable = false) : (this.emptyTable = true);
          this.partnersList = list;
          this.renderTable();
          if (this.tableHasChanged) {
            this.partnersListTable.renderRows();
          }
          this.tableHasChanged = false;
        },
      });
  }

  deletePartner(id: string): void {
    this.deleteService
      .deletePartner(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res.affectedRows > 0) {
            this.notifier.showNotification('success', 'Socio eliminado');
            this.sustractFromTable(id);
          } else {
            this.errorHandler.handleUnkonwError(res);
          }
        },
      });
  }

  /**
   * Abre la modal de confirmación de eliminación de usuario
   *
   */
  openConfirmDialog(id: string): void {
    const modalRef = this.modalService.open(ConfirmDialogComponent);
    modalRef.componentInstance.message = 'El socio será eliminado';
    modalRef.result
      .then((result) => {
        if (result) {
          this.deletePartner(id!);
        }
      })
      .catch((error) => {
        if (error) console.error(error);
      });
  }

  openCreatePartnerDialog() {
    const modalRef = this.modalService.open(
      CreatePartnerComponent,
      modalOptions
    );
    modalRef.result
      .then((result) => {
        if (result) {
          this.addToTable(result);
        } else {
          console.log('Modal closed');
        }
      })
      .catch((error) => {
        if (error) console.error(error);
      });
  }

  openEditPartnerDialog(uid: string) {
    const modalRef = this.modalService.open(EditPartnerComponent, modalOptions);
    modalRef.componentInstance.uid = uid;
    modalRef.result
      .then((result) => {
        if (result) {
          this.updateTable(result);
        }
      })
      .catch((error) => {
        if (error) console.error(error);
      });
  }

  getFormattedDate(d: any): string {
    return this.dateFormatter.getFormattedDate(d);
  }

  /************************* Gestión de tabla ************************************/

  private updateTable(updatedPartner: IPartner) {
    const index = this.partnersList.findIndex(
      (p) => p.partner_id === updatedPartner.partner_id
    );
    this.partnersList[index] = updatedPartner;
    this.renderTable();
  }

  private addToTable(newPartner: IPartner) {
    this.partnersList.push(newPartner);
    this.renderTable();
  }

  private sustractFromTable(id: string) {
    const index = this.partnersList.findIndex((p) => p.partner_id === id);
    this.partnersList.splice(index, 1);
    this.renderTable();
  }

  private renderTable() {
    this.dataSource = new MatTableDataSource(this.partnersList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.partnersListTable.renderRows();
  }

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
  /************************* Gestión de tabla ************************************/
}
