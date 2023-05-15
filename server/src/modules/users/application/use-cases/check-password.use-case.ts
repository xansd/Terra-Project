import { AuthToken } from "../../../shared/domain/value-objects/auth-token";
import { LoginRequest, SigninUseCase } from "./signin.use-case";

export interface ICheckPassword {
  checkPassword(credentials: LoginRequest): Promise<AuthToken>;
}

export class CheckPasswordUseCase implements ICheckPassword {
  constructor(private readonly siginService: SigninUseCase) {}

  async checkPassword(credentials: LoginRequest): Promise<AuthToken> {
    return this.siginService.signin(credentials);
  }
}
