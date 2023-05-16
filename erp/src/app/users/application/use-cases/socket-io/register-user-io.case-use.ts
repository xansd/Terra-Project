import { Inject, Injectable } from '@angular/core';
import { UserIOAdapter } from 'src/app/users/infrastructure/user-io.adapter';

export interface IRegisterActiveUserUseCase {
  registerActiveUserIO(id: string): void;
}

@Injectable({
  providedIn: 'root',
})
export class RegisterActiveUserUseCase implements IRegisterActiveUserUseCase {
  constructor(
    @Inject('usersIO') private readonly userIOAdapter: UserIOAdapter
  ) {}

  registerActiveUserIO(id: string): void {
    this.userIOAdapter.registerActiveUser(id);
  }
}
