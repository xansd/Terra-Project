import { Inject, Injectable } from '@angular/core';
import { UserIOAdapter } from 'src/app/users/infrastructure/user-io.adapter';

export interface IUnRegisterActiveUserUseCase {
  unRegisterActiveUserIO(id: string): void;
}

@Injectable({
  providedIn: 'root',
})
export class UnRegisterActiveUserUseCase
  implements IUnRegisterActiveUserUseCase
{
  constructor(
    @Inject('usersIO') private readonly userIOAdapter: UserIOAdapter
  ) {}

  unRegisterActiveUserIO(id: string): void {
    this.userIOAdapter.unRegisterActiveUser(id);
  }
}
