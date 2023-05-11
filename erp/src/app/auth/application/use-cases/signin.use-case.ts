import { Observable } from 'rxjs';
import { IAuthToken } from '../../domain/token';
import { IAuthAPIPort } from '../../domain/auth-api.port';
import { Inject, Injectable } from '@angular/core';

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
  constructor(@Inject('authAPI') private readonly authAPI: IAuthAPIPort) {}
  signin(credentials: LoginCredentials): Observable<IAuthToken> {
    return this.authAPI.signin(credentials);
  }
}
