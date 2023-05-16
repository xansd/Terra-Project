import { Injectable, Inject } from '@angular/core';
import { IAuthAPIPort } from '../../domain/auth-api.port';
import { Observable } from 'rxjs';
import { IAuthToken } from '../../domain/token';
import { LoginCredentials } from './signin.use-case';

export interface ICheckPasswordUseCase {
  checkPassword(username: string, password: string): Observable<IAuthToken>;
}
@Injectable({
  providedIn: 'root',
})
export class CheckPasswordUseCase implements ICheckPasswordUseCase {
  constructor(@Inject('authAPI') private readonly authAPI: IAuthAPIPort) {}
  checkPassword(email: string, password: string): Observable<IAuthToken> {
    const credentials: LoginCredentials = {
      email: email,
      password: password,
    };

    return this.authAPI.checkPassword(credentials);
  }
}
