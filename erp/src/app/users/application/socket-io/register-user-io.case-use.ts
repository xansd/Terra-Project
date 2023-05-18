import { Inject, Injectable } from '@angular/core';
import { UserIORepository } from 'src/app/users/infrastructure/user-io.repository';

export interface IRegisterActiveUserUseCase {
  registerActiveUserIO(id: string): void;
}

@Injectable({
  providedIn: 'root',
})
export class RegisterActiveUserUseCase implements IRegisterActiveUserUseCase {
  constructor(
    @Inject('usersIO') private readonly userIOAdapter: UserIORepository
  ) {}

  registerActiveUserIO(id: string): void {
    this.userIOAdapter.registerActiveUser(id);
  }
}
