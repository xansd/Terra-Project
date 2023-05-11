import { Observable } from 'rxjs';
import { IUserAPIPort } from '../../domain/user-api.port';
import { Roles } from '../../domain/roles';
import { Inject, Injectable } from '@angular/core';

export interface IUpdateRoleUserUseCase {
  updateRoleUser(id: string, role: Roles): Observable<void>;
}
@Injectable({
  providedIn: 'root',
})
export class updateRoleUserUseCase implements IUpdateRoleUserUseCase {
  constructor(@Inject('usersAPI') private readonly usersAPI: IUserAPIPort) {}
  updateRoleUser(id: string, role: Roles): Observable<void> {
    return this.usersAPI.updateRoleUser(id, role);
  }
}
