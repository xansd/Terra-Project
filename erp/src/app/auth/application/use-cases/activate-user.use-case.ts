import { Observable } from 'rxjs';
import { IAuthAPIPort } from '../../domain/auth-api.port';
import { Injectable, Inject } from '@angular/core';

export interface IActivateUserUseCase {
  activateUser(id: string): Observable<void>;
}

@Injectable({
  providedIn: 'root',
})
export class ActivateUserUseCase implements IActivateUserUseCase {
  constructor(@Inject('authAPI') private readonly authAPI: IAuthAPIPort) {}
  activateUser(id: string): Observable<void> {
    return this.authAPI.activateUser(id);
  }
}
