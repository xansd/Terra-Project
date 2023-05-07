import { Roles } from 'src/app/users/domain/roles';
import { Email } from 'src/app/users/domain/value-objects/email.value-object';
import { JwtTokenDecoder } from '../infrastructure/jwtTokenDecoder';
import { LocalRepository } from 'src/app/shared/domain/local-repository.port';
import { Inject, Injectable } from '@angular/core';

export interface IAuthToken {
  token: string;
}

export interface IDecodedToken {
  id: string;
  email: Email;
  role: Roles;
  HasToReset: boolean;
  iat: number;
}
@Injectable({
  providedIn: 'root',
})
export class AuthToken {
  key: string = 'authToken';
  authToken: IAuthToken | undefined = undefined;
  // decoder: JwtTokenDecoder;

  constructor(
    @Inject('LocalRepository') private storage: LocalRepository<string>,
    @Inject('JwtTokenDecoder') private jwtTokenDecoder: JwtTokenDecoder
  ) {
    // this.authToken = value;
    this.storage = storage;
    this.jwtTokenDecoder = jwtTokenDecoder;
  }

  getToken(): string | null {
    return this.storage.get('authToken');
  }

  saveToken(token: IAuthToken): void {
    this.storage.remove(this.key);
    this.storage.set('authToken', token as unknown as string);
  }

  removeToken(): void {
    this.storage.remove('authToken');
  }

  decodeToken(token: string): IDecodedToken {
    return this.jwtTokenDecoder.decodeToken(token);
  }

  isTokenExpired(token: IAuthToken): boolean {
    return this.jwtTokenDecoder.isTokenExpired(
      this.authToken as unknown as string
    );
  }
}
