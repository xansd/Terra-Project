import { Observable } from 'rxjs';
import { IAuthToken } from 'src/app/auth/domain/token';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ISigninUseCase {
  signin(credentials: LoginCredentials): Observable<IAuthToken>;
}

export interface ISignoutUseCase {
  signout(): void;
}
