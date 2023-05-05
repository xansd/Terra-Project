import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ITokenDecoder } from '../domain/token-decoder.interface';
import { IDecodedToken, Token } from '../domain/token';
import { TokenInvalidError } from '../domain/token.exceptions';

@Injectable()
export class JwtTokenDecoder implements ITokenDecoder {
  constructor(private jwtHelper: JwtHelperService) {}

  decodeToken(token: string): IDecodedToken {
    const decodedToken = this.jwtHelper.decodeToken(token as unknown as string);
    if (!decodedToken) throw new TokenInvalidError();
    return decodedToken;
  }

  isTokenExpired(token: string): boolean {
    if (!token) return true;
    return this.jwtHelper.isTokenExpired(token as unknown as string);
  }
}
