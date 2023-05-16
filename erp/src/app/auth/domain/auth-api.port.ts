import { Observable } from 'rxjs';
import { IAuthToken } from './token';
import { LoginCredentials } from '../application/use-cases/signin.use-case';
import { Roles } from 'src/app/users/domain/roles';

export interface IAuthAPIPort {
  signin(credentials: LoginCredentials): Observable<IAuthToken>;
  checkPassword(credentials: LoginCredentials): Observable<IAuthToken>;
  changePassword(data: {
    id: string;
    password: string;
    isAdminAction?: boolean;
  }): Observable<void>;
  activateUser(id: string): Observable<void>;
  blockUser(id: string): Observable<void>;
  updateRoleUser(id: string, role: Roles): Observable<void>;
}
