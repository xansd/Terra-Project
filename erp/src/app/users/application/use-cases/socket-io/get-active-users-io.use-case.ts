import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/users/domain/user';
import { UserIOAdapter } from 'src/app/users/infrastructure/user-io.adapter';

export interface IGetActiveUsersIOUseCase {
  getActiveUsersIO(): Observable<IUser[]>;
}
@Injectable({
  providedIn: 'root',
})
export class GetActiveUsersIOUseCase implements IGetActiveUsersIOUseCase {
  constructor(
    @Inject('usersIO') private readonly userIOAdapter: UserIOAdapter
  ) {}
  getActiveUsersIO(): Observable<IUser[]> {
    return this.userIOAdapter.getActiveUsers();
  }
}
