import { Observable } from 'rxjs';
import { IUserAPIPort } from '../../domain/user-api.port';
import { Injectable, Inject } from '@angular/core';

export interface IActivateUserUseCase {
  activateUser(id: string): Observable<void>;
}

@Injectable({
  providedIn: 'root',
})
export class ActivateUserUseCase implements IActivateUserUseCase {
  constructor(@Inject('usersAPI') private readonly usersAPI: IUserAPIPort) {}
  activateUser(id: string): Observable<void> {
    return this.usersAPI.activateUser(id);
  }
}
