import { Observable } from 'rxjs';
import { LoginCredentials } from '../application/use-cases/port/auth-use-cases.port';
import { IAuthToken } from './token';

export interface IAuthAPIPort {
  signin(credentials: LoginCredentials): Observable<IAuthToken>;
  changePassword(oldPassword: string, newPassword: string): Observable<void>;
}
