import { Observable } from 'rxjs';
import { IAuthToken } from './token';
import { LoginCredentials } from '../application/use-cases/signin.use-case';

export interface IAuthAPIPort {
  signin(credentials: LoginCredentials): Observable<IAuthToken>;
  changePassword(oldPassword: string, newPassword: string): Observable<void>;
}
