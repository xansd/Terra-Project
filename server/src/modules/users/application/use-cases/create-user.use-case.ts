import { IUserRepository } from "../../domain/user-repository.interface";
import { IUserDTO } from "../../infraestructure/user.dto";
import { UserAdapter } from "../user.adapter";
import { IUser, UserAlreadyExistsError } from "../../domain";
import Logger from "../../../shared/infraestructure/logger";

export interface ICreateUser {
  createUser(user: IUserDTO): Promise<IUser>;
}
export class CreateUserUseCase implements ICreateUser {
  private userAdapter: UserAdapter = new UserAdapter();
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
    const user = this.userAdapter.toDomain(userDTO);
    await this.userRepository.create(user);

    return user;
  }
}
