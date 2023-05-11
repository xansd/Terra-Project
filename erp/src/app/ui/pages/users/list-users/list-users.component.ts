import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { IUser, User } from 'src/app/users/domain/user';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from 'src/app/ui/shared/components/confirm-dialog/confirm-dialog.component';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import { BreakpointObserver } from '@angular/cdk/layout';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { GetAllUsersUserCase } from 'src/app/users/application/use-cases/get-all-users.use-case';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CreateUserComponent } from '../create-user/create-user.component';

const modalOptions: NgbModalOptions = {
  backdrop: 'static',
  keyboard: false,
};

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss'],
})
export class ListUsersComponent implements OnInit, OnDestroy {
  usersList: IUser[] = [];
  dataSource!: MatTableDataSource<IUser>;
  tableHasChanged = false;
  emptyTable = false;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  @ViewChild(MatTable)
  usersListTable!: MatTable<IUser>;
  displayedColumns: string[] = ['id', 'creation', 'email', 'role', 'state'];
  columnDefinitions = [
    { def: 'id', show: false },
    { def: 'email', show: true },
    { def: 'role', show: true },
    { def: 'state', show: true },
    { def: 'creation', show: true },
    { def: 'actions', show: true },
  ];
  isLargeScreen = false;

  private destroy$ = new Subject();

  constructor(
    private modalService: NgbModal,
    private notifier: NotificationAdapter,
    private usersService: GetAllUsersUserCase,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  /**
   * Retorna la lisata de usuarios
   */
  getUsers(): void {
    this.usersService
      .getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users: IUser[]) => {
          users.length ? (this.emptyTable = false) : (this.emptyTable = true);
          this.usersList = users;
          this.dataSource = new MatTableDataSource(this.usersList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          if (this.tableHasChanged) {
            this.usersListTable.renderRows();
          }
          this.tableHasChanged = false;
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  /**
   * Retorna el nombre del rol pasando como parametro su indice
   * @param {number} role
   * @returns
   */
  getRoleFromNumber(role: number): string {
    return User.getRoleNameFromNumber(role);
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

  /**
   * Abre la modal de edición de usuario
   * @param {IUser} user
   */
  openEditUser(user: IUser): void {
    const modalRef = this.modalService.open(EditUserComponent, modalOptions);
    modalRef.componentInstance.user = user;
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

  updateTable(updatedUser: User) {
    const index = this.usersList.findIndex(
      (u) => u.user_id === updatedUser.user_id
    );
    this.usersList[index] = updatedUser;
    this.dataSource = new MatTableDataSource(this.usersList);
    this.usersListTable.renderRows();
  }

  /**
   * Abre la modal de confirmación de eliminación de usuario
   *
   */
  openConfirmDialog(): void {
    const modalRef = this.modalService.open(ConfirmDialogComponent);
    modalRef.componentInstance.message = 'El usuario será eliminado';
    modalRef.result
      .then((result) => {
        if (result === true) {
          console.log('Modal confirmed');
        } else {
          console.log('Modal closed');
        }
      })
      .catch((error) => {
        if (error) console.error(error);
      });
  }

  openCreateUserDialog(): void {
    const modalRef = this.modalService.open(CreateUserComponent, modalOptions);
    modalRef.result
      .then((result) => {
        if (result === true) {
          console.log('Modal confirmed');
        } else {
          console.log('Modal closed');
        }
      })
      .catch((error) => {
        if (error) console.error(error);
      });
  }

  // Esconde el paginator en pantallas pequeñas
  breakPointObserver(): void {
    this.breakpointObserver
      .observe(['(min-width: 500px)'])
      .subscribe((result) => (this.isLargeScreen = result.matches));
  }
}
