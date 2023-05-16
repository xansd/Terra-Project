import { Observable } from 'rxjs';
import { Roles } from '../../../users/domain/roles';
import { Inject, Injectable } from '@angular/core';
import { IAuthAPIPort } from '../../domain/auth-api.port';

export interface IUpdateRoleUserUseCase {
  updateRoleUser(id: string, role: Roles): Observable<void>;
}
@Injectable({
  providedIn: 'root',
})
export class updateRoleUserUseCase implements IUpdateRoleUserUseCase {
  constructor(@Inject('authAPI') private readonly authAPI: IAuthAPIPort) {}
  updateRoleUser(id: string, role: Roles): Observable<void> {
    return this.authAPI.updateRoleUser(id, role);
  }
}
