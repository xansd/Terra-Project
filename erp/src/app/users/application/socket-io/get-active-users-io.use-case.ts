import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/users/domain/user';
import { UserIORepository } from 'src/app/users/infrastructure/user-io.repository';

export interface IGetActiveUsersIOUseCase {
  getActiveUsersIO(): Observable<IUser[]>;
}
@Injectable({
  providedIn: 'root',
})
export class GetActiveUsersIOUseCase implements IGetActiveUsersIOUseCase {
  constructor(
    @Inject('usersIO') private readonly userIOAdapter: UserIORepository
  ) {}
  getActiveUsersIO(): Observable<IUser[]> {
    return this.userIOAdapter.getActiveUsers();
  }
}
