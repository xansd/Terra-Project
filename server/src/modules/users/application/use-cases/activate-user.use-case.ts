import { IUserRepository } from "../../domain/user-repository.interface";
import { UserAdapter } from "../user.adapter";

export interface IActivateUser {
  activateUser(id: string): Promise<void>;
  blockUser(id: string): Promise<void>;
}

export class ActivateUserUseCase implements IActivateUser {
  userAdapter: UserAdapter = new UserAdapter();
  constructor(private readonly userRepository: IUserRepository) {}

  async activateUser(id: string): Promise<void> {
    await this.userRepository.activateUser(id);
  }

  async blockUser(id: string): Promise<void> {
    await this.userRepository.blockUser(id);
  }
}
