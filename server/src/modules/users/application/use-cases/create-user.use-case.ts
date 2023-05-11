import { IUserRepository } from "../../domain/user-repository.port";
import { UserMapper } from "../user-dto.mapper";
import { IUser, Role, UserAlreadyExistsError } from "../../domain";
import Logger from "../../../../apps/utils/logger";
import { Password } from "../../domain/value-objects/password.value-object";
import { Email } from "../../domain/value-objects/email.value-object";
import appConfig from "../../../../config/app-config";

const CONFIG = appConfig;

export interface ICreateUser {
  createUser(email: string, role_id: Role): Promise<IUser>;
}
export class CreateUserUseCase implements ICreateUser {
  private userMapper: UserMapper = new UserMapper();
  constructor(private readonly userRepository: IUserRepository) {}

  async createUser(email: string, role_id: Role): Promise<IUser> {
    const userExists = await this.userRepository.checkUserExistenceByEmail(
      email
    );

    if (userExists) {
      const userAlreadyExistsError = new UserAlreadyExistsError(email);
      Logger.error(
        `user-repository : createUser : ${userAlreadyExistsError.message}`
      );
      throw userAlreadyExistsError;
    }

    const validatedEmail = Email.create(email);
    const passwordHash = await Password.genPasswordHash(
      CONFIG.DEFAULT_USER_PASSWORD!
    );

    const user = await this.userRepository.create(
      validatedEmail,
      passwordHash,
      role_id
    );

    return user;
  }
}
