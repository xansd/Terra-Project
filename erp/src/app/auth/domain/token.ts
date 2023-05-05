import { LocalRepository } from 'src/app/shared/infraestructure/local-repository.interface';
import { Roles } from 'src/app/users/domain/roles';
import { Email } from 'src/app/users/domain/value-objects/email.value-object';
import { JwtTokenDecoder } from '../infrastructure/jwtTokenDecoder';

export interface IToken {
  authToken: string;
  key: string;
  storage: LocalRepository<string>;
  decoder: JwtTokenDecoder;
}

export interface IDecodedToken {
  id: string;
  email: Email;
  role: Roles;
  HasToReset: boolean;
  iat: number;
}

export class Token implements IToken {
  key: string = 'authToken';
  storage: LocalRepository<string>;
  authToken: string;
  decoder: JwtTokenDecoder;

  private constructor(
    value: string,
    storage: LocalRepository<string>,
    jwtTokenDecoder: JwtTokenDecoder
  ) {
    this.authToken = value;
    this.storage = storage;
    this.decoder = jwtTokenDecoder;
  }

  getToken(): string | null {
    return this.storage.get(this.key);
  }

  saveToken(token: Token): void {
    this.storage.remove(this.key);
    this.storage.set(this.key, token.authToken);
  }

  decodeToken(token: string): IDecodedToken {
    return this.decoder.decodeToken(token);
  }

  isTokenExpired(): boolean {
    return this.decoder.isTokenExpired(this.authToken);
  }
}

// ejemplo de uso
// const userRepository = new UserRepository(new LocalStorageRepository());
// const token = 'abc123';
// userRepository.saveToken(token);
// console.log(userRepository.getToken()); // 'abc123'
