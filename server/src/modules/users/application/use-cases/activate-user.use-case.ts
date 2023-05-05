import { IUserRepository } from "../../domain/user-repository.interface";
import { UserMapper } from "../user-dto.mapper";

export interface IActivateUser {
  activateUser(id: string): Promise<void>;
  blockUser(id: string): Promise<void>;
}

export class ActivateUserUseCase implements IActivateUser {
  userMapper: UserMapper = new UserMapper();
  constructor(private readonly userRepository: IUserRepository) {}

  async activateUser(id: string): Promise<void> {
    await this.userRepository.activateUser(id);
  }

  async blockUser(id: string): Promise<void> {
    await this.userRepository.blockUser(id);
  }
}
