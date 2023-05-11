import { Observable } from 'rxjs';
import { IUserAPIPort } from '../../domain/user-api.port';
import { Injectable, Inject } from '@angular/core';

export interface IBlockUserUseCase {
  blockUser(id: string): Observable<void>;
}
@Injectable({
  providedIn: 'root',
})
export class BlockUserUseCase implements IBlockUserUseCase {
  constructor(@Inject('usersAPI') private readonly usersAPI: IUserAPIPort) {}
  blockUser(id: string): Observable<void> {
    return this.usersAPI.blockUser(id);
  }
}
