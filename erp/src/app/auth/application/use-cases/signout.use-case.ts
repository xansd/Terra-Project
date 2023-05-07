import { Injectable } from '@angular/core';
import { AuthToken } from '../../domain/token';
import { ISignoutUseCase } from './port/auth-use-cases.port';

@Injectable({
  providedIn: 'root',
})
export class SignoutUseCase implements ISignoutUseCase {
  constructor(private authTokenService: AuthToken) {}
  signout(): void {
    this.authTokenService.removeToken();
  }
}
