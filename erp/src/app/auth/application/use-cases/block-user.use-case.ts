import { Observable } from 'rxjs';
import { IAuthAPIPort } from '../../domain/auth-api.port';
import { Injectable, Inject } from '@angular/core';

export interface IBlockUserUseCase {
  blockUser(id: string): Observable<void>;
}
@Injectable({
  providedIn: 'root',
})
export class BlockUserUseCase implements IBlockUserUseCase {
  constructor(@Inject('authAPI') private readonly authAPI: IAuthAPIPort) {}
  blockUser(id: string): Observable<void> {
    return this.authAPI.blockUser(id);
  }
}
