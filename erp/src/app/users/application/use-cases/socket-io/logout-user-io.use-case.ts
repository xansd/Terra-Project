import { Inject, Injectable } from '@angular/core';
import { UserIOAdapter } from 'src/app/users/infrastructure/user-io.adapter';
import { SignoutUseCase } from '../../../../auth/application/use-cases/signout.use-case';

export interface ILogOutActiveUserUseCase {
  logOutActiveUserUseCase(id: string): void;
  // removeTokenFromRemote(): void;
}

@Injectable({
  providedIn: 'root',
})
export class LogOutActiveUserUseCase implements ILogOutActiveUserUseCase {
  constructor(
    @Inject('usersIO') private readonly userIOAdapter: UserIOAdapter,
    private readonly signoutService: SignoutUseCase
  ) {}

  logOutActiveUserUseCase(id: string): void {
    this.userIOAdapter.logOutRemoteUser(id);
  }

  // removeTokenFromRemote(): void {
  //   this.userIOAdapter.removeToken().subscribe({
  //     next: (id: string) => {
  //       if (id) {
  //         this.signoutService.signoutFromRemote(id);
  //       }
  //     },
  //     error: (error: Error) => {
  //       console.error(error);
  //     },
  //   });
  // }
}
