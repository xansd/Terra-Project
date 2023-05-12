import { IUserRepository } from "../../domain/user-repository.port";
import { UserMapper } from "../user-dto.mapper";

export interface IActivateUser {
  activateUser(id: string): Promise<void>;
  blockUser(id: string): Promise<void>;
}

export class ActivateUserUseCase implements IActivateUser {
  userMapper: UserMapper = new UserMapper();
  constructor(private readonly userRepository: IUserRepository) {}

  async activateUser(id: string): Promise<void> {
    const result = await this.userRepository.activateUser(id);
    return result;
  }

  async blockUser(id: string): Promise<void> {
    const result = await this.userRepository.blockUser(id);
    return result;
  }
}
