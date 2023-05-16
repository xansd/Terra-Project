import { Inject, Injectable } from '@angular/core';
import { AuthToken, IAuthToken } from '../../domain/token';
import { IUnRegisterActiveUserUseCase } from '../../../users/application/use-cases/socket-io/unregister-user-io.use-case';

export interface ISignoutUseCase {
  signout(): void;
  signoutFromRemote(id: string): boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SignoutUseCase implements ISignoutUseCase {
  constructor() {}
  signout(): void {}

  signoutFromRemote(id: string): boolean {
    return true;
  }
}
