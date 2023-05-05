import { Observable } from 'rxjs';
import { IUser } from '../user';

export interface IUsersManage {
  getUsers(): Observable<IUser[]>;
}
