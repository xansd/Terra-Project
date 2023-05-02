import { IUser } from "../../domain";
import { IUserRepository } from "../../domain/user-repository.interface";

export interface IGetUser {
  getUser(id: string): Promise<IUser>;
}

export class GetUserUseCase implements IGetUser {
  constructor(private readonly userRepository: IUserRepository) {}

  async getUser(id: string): Promise<IUser> {
    const user = await this.userRepository.getById(id);
    return user;
  }
}
