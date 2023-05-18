import { Inject, Injectable } from '@angular/core';
import { UserIORepository } from 'src/app/users/infrastructure/user-io.repository';

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
    @Inject('usersIO') private readonly userIOAdapter: UserIORepository
  ) {}

  unRegisterActiveUserIO(id: string): void {
    this.userIOAdapter.unRegisterActiveUser(id);
  }
}
