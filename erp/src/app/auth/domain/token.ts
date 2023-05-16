import { Roles } from 'src/app/users/domain/roles';
import { JwtTokenDecoder } from '../infrastructure/jwtTokenDecoder.adapter';
import { LocalRepository } from 'src/app/shared/domain/local-repository.port';
import { Inject, Injectable } from '@angular/core';
import { TokenInvalidError } from './auth.exceptions';

export interface IAuthToken {
  key: string;
  authToken: string | undefined;

  getToken(): string | null;
  removeToken(): void;
  saveToken(token: IAuthToken): void;
  isLogged(): boolean;
  getUserRole(): Roles | undefined;
  getUserID(): string;
  getUserName(): string;
  decodeToken(token: string): IDecodedToken;
  isTokenExpired(token: IAuthToken): boolean;
}

export interface IDecodedToken {
  id: string;
  email: string;
  role: Roles;
  hasToReset: boolean;
  iat: number;
}
@Injectable({
  providedIn: 'root',
})
export class AuthToken implements IAuthToken {
  key: string = 'authToken';
  authToken: string | undefined = undefined;
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

  removeToken(): void {
    this.storage.remove('authToken');
  }

  saveToken(token: IAuthToken): void {
    this.storage.remove(this.key);
    this.storage.set('authToken', token as unknown as string);
  }

  isLogged(): boolean {
    const token = this.getToken();
    if (!token) {
      throw new TokenInvalidError();
    }
    return !this.isTokenExpired(token as unknown as IAuthToken);
  }

  getUserRole(): Roles | undefined {
    const token = this.getToken();
    if (!token) {
      throw new TokenInvalidError();
    }
    const decoded = this.decodeToken(token);
    return decoded.role;
  }

  getUserName(): string {
    const token = this.getToken();
    if (!token) {
      throw new TokenInvalidError();
    }
    const decoded = this.decodeToken(token);
    return decoded.email;
  }

  getUserID(): string {
    const token = this.getToken();
    if (!token) {
      throw new TokenInvalidError();
    }
    const decoded = this.decodeToken(token);
    return decoded.id;
  }

  getUserHasToReset(): boolean {
    const token = this.getToken();
    if (!token) {
      throw new TokenInvalidError();
    }
    const decoded = this.decodeToken(token);
    return decoded.hasToReset;
  }

  decodeToken(token: string): IDecodedToken {
    return this.jwtTokenDecoder.decodeToken(token);
  }

  isTokenExpired(token: IAuthToken): boolean {
    return this.jwtTokenDecoder.isTokenExpired(token as unknown as string);
  }
}
