import { IUserRepository } from "../../domain/user-repository.interface";

export interface IDeleteUser {
  deleteUser(id: string): Promise<void>;
}

export class DeleteUserUseCase implements IDeleteUser {
  constructor(private readonly userRepository: IUserRepository) {}

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
