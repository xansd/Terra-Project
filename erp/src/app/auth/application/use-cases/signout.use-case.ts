import { Injectable } from '@angular/core';
import { AuthToken } from '../../domain/token';

export interface ISignoutUseCase {
  signout(): void;
}

@Injectable({
  providedIn: 'root',
})
export class SignoutUseCase implements ISignoutUseCase {
  constructor(private authTokenService: AuthToken) {}
  signout(): void {
    this.authTokenService.removeToken();
  }
}
