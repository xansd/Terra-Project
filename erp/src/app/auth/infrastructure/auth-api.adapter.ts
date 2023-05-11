import { Observable } from 'rxjs';
import { IAuthToken } from '../domain/token';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import SERVER from '../../config/server.config';
import { IAuthAPIPort } from '../domain/auth-api.port';
import { LoginCredentials } from '../application/use-cases/signin.use-case';

const API_URI = SERVER.API_URI + '/users';

@Injectable({ providedIn: 'root' })
export class AuthAPIAdapter implements IAuthAPIPort {
  constructor(private http: HttpClient) {}

  signin(credentials: LoginCredentials): Observable<IAuthToken> {
    return this.http.post<IAuthToken>(`${API_URI}/signin`, credentials);
  }
  changePassword(oldPassword: string, newPassword: string): Observable<void> {
    throw new Error('Method not implemented.');
  }
}
