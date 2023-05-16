import { Observable } from 'rxjs';
import { IUser } from './user';

export interface IUserIOPort {
  registerActiveUser(id: string): void;
  unRegisterActiveUser(id: string): void;
  getActiveUsers(): Observable<IUser[]>;
}
