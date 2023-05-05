import { IDecodedToken } from './token';

export interface ITokenDecoder {
  decodeToken(token: string): IDecodedToken;
  isTokenExpired(token: string): boolean;
}
