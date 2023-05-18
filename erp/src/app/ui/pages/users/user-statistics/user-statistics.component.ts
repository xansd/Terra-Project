import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { IUser } from 'src/app/users/domain/user';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { GetActiveUsersIOUseCase } from 'src/app/users/application/socket-io/get-active-users-io.use-case';
import { LogOutActiveUserUseCase } from 'src/app/users/application/socket-io/logout-user-io.use-case';

@Component({
  selector: 'app-user-statistics',
  templateUrl: './user-statistics.component.html',
  styleUrls: ['./user-statistics.component.scss'],
})
export class UserStatisticsComponent implements OnInit, OnDestroy {
  activeUsers: IUser[] = [];
  dataSource!: MatTableDataSource<IUser>;
  tableHasChanged = false;
  emptyTable = false;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  @ViewChild(MatTable)
  usersListTable!: MatTable<IUser>;
  displayedColumns: string[] = ['email', 'user_id', 'actions'];
  private destroy$ = new Subject();
  selectedRowIndex: string | null = null;

  constructor(
    private getUsersIOService: GetActiveUsersIOUseCase,
    private logOutRemoteUserService: LogOutActiveUserUseCase
  ) {}

  ngOnInit(): void {
    this.getActiveUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  selectRow(rowId: string) {
    this.selectedRowIndex = rowId;
  }

  getActiveUsers(): void {
    this.getUsersIOService
      .getActiveUsersIO()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (activeUsers: IUser[]) => {
          this.activeUsers = activeUsers;
          this.dataSource = new MatTableDataSource(this.activeUsers);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          if (this.tableHasChanged) {
            this.usersListTable.renderRows();
          }
          this.tableHasChanged = false;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  logOutRemoteUser(id: string): void {
    this.logOutRemoteUserService.logOutActiveUserUseCase(id);
  }
}
