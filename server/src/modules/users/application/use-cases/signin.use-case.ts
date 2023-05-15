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
    // Comprobamos el email
    const user: IUser = await this.userRepository.findByEmail(
      credentials.email
    );
    // Si no existe el email lanzamos excepción
    if (!user) {
      throw new InvalidCredentialsError();
    }
    // Si el usuario no está activo lanzamos excepción
    if (user.active == false) {
      throw new UserNotActive();
    }

    // Verificamos si el password del usuario coincide con el hash guardado
    const passwordMatch = await Password.validatePasswordHash(
      credentials.password,
      user.passwordHash!
    );
    if (!passwordMatch) {
      throw new InvalidCredentialsError();
    }

    // Cuando fue el último reset del password
    const lastPasswordUpdate = user.password_last_reset;
    // Si no exite valor lanzamos excpeción
    if (!lastPasswordUpdate) {
      return createToken(user, true);
    }

    // Calculamos si la fecha ha sido sobrepasada
    const now = new Date();
    const passwordExpirationTime = 90; // días
    const timeSinceLastUpdate =
      (now.getTime() - new Date(lastPasswordUpdate).getTime()) /
      (1000 * 60 * 60 * 24);
    if (
      timeSinceLastUpdate > passwordExpirationTime ||
      credentials.password === Password.DEFAULT_PASSWORD
    ) {
      return createToken(user, true);
    }

    // Éxito: devolvemos el token
    const token = createToken(user, false);
    return token;
  }
}
