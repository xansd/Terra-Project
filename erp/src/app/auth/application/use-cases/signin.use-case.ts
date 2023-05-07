import { Observable } from 'rxjs';
import { IAuthToken } from '../../domain/token';
import { ISigninUseCase, LoginCredentials } from './port/auth-use-cases.port';
import { IAuthAPIPort } from '../../domain/auth-api.port';

export class SigninUseCase implements ISigninUseCase {
  constructor(private readonly authAPI: IAuthAPIPort) {}
  signin(credentials: LoginCredentials): Observable<IAuthToken> {
    return this.authAPI.signin(credentials);
  }
}
