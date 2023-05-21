import { Inject, Injectable } from '@angular/core';
import { SignoutUseCase } from 'src/app/auth/application/use-cases/signout.use-case';
import { UserIORepository } from 'src/app/users/infrastructure/user-io.repository';

export interface ILogOutActiveUserUseCase {
  logOutActiveUserUseCase(id: string): void;
  // removeTokenFromRemote(): void;
}

@Injectable({
  providedIn: 'root',
})
export class LogOutActiveUserUseCase implements ILogOutActiveUserUseCase {
  constructor(
    @Inject('usersIO') private readonly userIOAdapter: UserIORepository,
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
  //     }
  //   });
  // }
}
