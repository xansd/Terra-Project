import { Observable } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { IUserAPIPort } from '../domain/user-api.port';

export interface IDeleteUserUseCase {
  deleteUser(id: string): Observable<void>;
}
@Injectable({
  providedIn: 'root',
})
export class deleteUserUseCase implements IDeleteUserUseCase {
  constructor(@Inject('usersAPI') private readonly usersAPI: IUserAPIPort) {}
  deleteUser(id: string): Observable<void> {
    return this.usersAPI.deleteUser(id);
  }
}
