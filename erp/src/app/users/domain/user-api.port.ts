import { Observable } from 'rxjs';
import { Roles } from './roles';
import { IUser } from './user';
import { Email } from '../../shared/domain/value-objects/email.value-object';

export interface IUserAPIPort {
  getAllUsers(): Observable<IUser[]>;
  createUser(email: Email, role_id: Roles): Observable<void>;
  deleteUser(id: string): Observable<void>;
}
