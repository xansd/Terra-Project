import { IUserRepository } from "../../domain/user-repository.port";
import { IUserDTO } from "../user.dto";
import { UserMapper } from "../user-dto.mapper";
import { IUser, UserAlreadyExistsError } from "../../domain";
import Logger from "../../../../apps/utils/logger";
import { Password } from "../../domain/value-objects/password.value-object";

export interface ICreateUser {
  createUser(user: IUserDTO): Promise<IUser>;
}
export class CreateUserUseCase implements ICreateUser {
  private userMapper: UserMapper = new UserMapper();
  constructor(private readonly userRepository: IUserRepository) {}

  async createUser(userDTO: IUserDTO): Promise<IUser> {
    const userExists = await this.userRepository.checkUserExistenceByEmail(
      userDTO.email
    );

    if (userExists) {
      const userAlreadyExistsError = new UserAlreadyExistsError(userDTO.email);
      Logger.error(
        `user-repository : createUser : ${userAlreadyExistsError.message}`
      );
      throw userAlreadyExistsError;
    }

    const user = this.userMapper.toDomain(userDTO);
    const passwordHash = await Password.genPasswordHash(user.password?.value!);
    user.passwordHash = passwordHash;

    await this.userRepository.create(user);

    return user;
  }
}
