import { Observable } from 'rxjs';
import { IUserAPIPort } from '../../domain/user-api.port';

export interface IDeleteUserUseCase {
  deleteUser(id: string): Observable<void>;
}

export class deleteUserUseCase implements IDeleteUserUseCase {
  constructor(private readonly usersAPI: IUserAPIPort) {}
  deleteUser(id: string): Observable<void> {
    return this.usersAPI.deleteUser(id);
  }
}
