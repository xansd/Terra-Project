import { Observable } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { IUser } from '../domain/user';
import { IUserAPIPort } from '../domain/user-api.port';

export interface IGetAllUsersUserCase {
  getAllUsers(): Observable<IUser[]>;
}
@Injectable({
  providedIn: 'root',
})
export class GetAllUsersUserCase implements IGetAllUsersUserCase {
  constructor(@Inject('usersAPI') private readonly usersAPI: IUserAPIPort) {}
  getAllUsers(): Observable<IUser[]> {
    return this.usersAPI.getAllUsers();
  }
}
