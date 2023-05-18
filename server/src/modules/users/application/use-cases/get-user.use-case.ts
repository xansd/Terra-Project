import Logger from "../../../../apps/utils/logger";
import { IUser, UserDoesNotExistError } from "../../domain";
import { IUserRepository } from "../../domain/user.repository.port";

export interface IGetUser {
  getUser(id: string): Promise<IUser>;
}

export class GetUserUseCase implements IGetUser {
  constructor(private readonly userRepository: IUserRepository) {}

  async getUser(id: string): Promise<IUser> {
    const user = await this.userRepository.getById(id);
    if (!user) {
      Logger.error(`user-repository : getUser : ${UserDoesNotExistError}`);
      throw new UserDoesNotExistError();
    }
    return user;
  }
}
