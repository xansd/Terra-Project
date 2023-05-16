import { Injectable, Inject } from '@angular/core';
import { IAuthAPIPort } from '../../domain/auth-api.port';
import { Observable } from 'rxjs';

export interface IUpdatePasswordUseCase {
  updatePassword(
    id: string,
    password: string,
    isAdminAction?: boolean
  ): Observable<void>;
}
@Injectable({
  providedIn: 'root',
})
export class UpdatePasswordUseCase implements IUpdatePasswordUseCase {
  constructor(@Inject('authAPI') private readonly authAPI: IAuthAPIPort) {}
  updatePassword(
    id: string,
    password: string,
    isAdminAction?: boolean
  ): Observable<void> {
    return this.authAPI.changePassword({
      id: id,
      password: password,
      isAdminAction: isAdminAction,
    });
  }
}
