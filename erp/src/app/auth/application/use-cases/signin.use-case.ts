import { Observable, tap } from 'rxjs';
import { IAuthToken } from '../../domain/token';
import { IAuthAPIPort } from '../../domain/auth-api.port';
import { Inject, Injectable } from '@angular/core';
import { IRegisterActiveUserUseCase } from 'src/app/users/application/socket-io/register-user-io.case-use';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ISigninUseCase {
  signin(credentials: LoginCredentials): Observable<IAuthToken>;
}

@Injectable({
  providedIn: 'root',
})
export class SigninUseCase implements ISigninUseCase {
  constructor(
    @Inject('authAPI') private readonly authAPI: IAuthAPIPort,
    @Inject('authToken') private authTokenService: IAuthToken,
    @Inject('registerUserIO')
    private userSocketService: IRegisterActiveUserUseCase
  ) {}
  signin(credentials: LoginCredentials): Observable<IAuthToken> {
    return this.authAPI.signin(credentials).pipe(
      tap((token: IAuthToken) => {
        if (token) {
          this.authTokenService.saveToken(token);
          const uid = this.authTokenService.getUserID();
          this.userSocketService.registerActiveUserIO(uid);
        }
      })
    );
  }
}
