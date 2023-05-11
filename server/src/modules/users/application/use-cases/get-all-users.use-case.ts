import Logger from "../../../../apps/utils/logger";
import { IUser, IUserRepository, UsersNotFoundError } from "../../domain";

export interface IGetAllUsers {
  getAllUsers(): Promise<IUser[]>;
}

export class GetAllUsersUseCase implements IGetAllUsers {
  constructor(private readonly userRepository: IUserRepository) {}

  async getAllUsers(): Promise<IUser[]> {
    const users = await this.userRepository.getAll();
    if (users.length === 0) {
      const usersNotFound = new UsersNotFoundError();
      Logger.error(`user-repository : getAllUsers : ${usersNotFound.message}`);
      throw usersNotFound;
    }

    return users;
  }
}
