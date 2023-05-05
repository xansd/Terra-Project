import {
  AuthToken,
  createToken,
} from "../../../shared/domain/value-objects/auth-token";
import {
  IUser,
  IUserRepository,
  InvalidCredentialsError,
  UserHasToResetError,
  UserNotActive,
} from "../../domain";
import { Password } from "../../domain/value-objects/password.value-object";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ISignin {
  signin(credentials: LoginRequest): Promise<AuthToken>;
}

export class SigninUseCase implements ISignin {
  constructor(private readonly userRepository: IUserRepository) {}

  async signin(credentials: LoginRequest): Promise<AuthToken> {
    const user: IUser = await this.userRepository.findByEmail(
      credentials.email
    );
    if (!user) {
      throw new InvalidCredentialsError();
    }
    if (user.active === false) {
      throw new UserNotActive();
    }

    const lastPasswordUpdate = user.lastReset;

    if (!lastPasswordUpdate) {
      throw new UserHasToResetError();
    }

    const now = new Date();
    const passwordExpirationTime = 90; // días
    const timeSinceLastUpdate =
      (now.getTime() - lastPasswordUpdate.getTime()) / (1000 * 60 * 60 * 24);
    if (timeSinceLastUpdate > passwordExpirationTime) {
      throw new UserHasToResetError();
    }

    const passwordMatch = await Password.validatePasswordHash(
      credentials.password,
      user.password!.value
    );
    if (!passwordMatch) {
      throw new InvalidCredentialsError();
    }
    const token = createToken(user);
    return token;
  }
}
