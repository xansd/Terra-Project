import { Observable } from 'rxjs';
import { Roles } from './roles';
import { IUser } from './user';
import { Email } from './value-objects/email.value-object';

export interface IUserAPIPort {
  getUserByID(id: string): Observable<IUser>;
  getAllUsers(): Observable<IUser[]>;
  createUser(email: Email, role_id: Roles): Observable<void>;
  deleteUser(id: string): Observable<void>;
  activateUser(id: string): Observable<void>;
  blockUser(id: string): Observable<void>;
  updateRoleUser(id: string, role: Roles): Observable<void>;
  restorePassword(id: string, password: string): Observable<void>;
}
