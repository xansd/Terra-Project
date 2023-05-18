import { Inject, Injectable } from '@angular/core';
import { AuthToken } from '../../domain/token';
import { IUnRegisterActiveUserUseCase } from 'src/app/users/application/socket-io/unregister-user-io.use-case';

export interface ISignoutUseCase {
  signout(): void;
  signoutFromRemote(id: string): boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SignoutUseCase implements ISignoutUseCase {
  constructor(
    private authTokenService: AuthToken,
    @Inject('unRegisterUserIO')
    private userSocketunRegister: IUnRegisterActiveUserUseCase
  ) {}

  signout(): void {
    const uid = this.authTokenService.getUserID();
    this.authTokenService.removeToken();
    this.userSocketunRegister.unRegisterActiveUserIO(uid);
  }

  signoutFromRemote(id: string): boolean {
    try {
      const uid = this.authTokenService.getUserID();
      this.authTokenService.removeToken();
      this.userSocketunRegister.unRegisterActiveUserIO(uid);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
