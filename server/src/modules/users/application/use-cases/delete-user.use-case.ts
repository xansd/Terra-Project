import { IUserRepository } from "../../domain/user.repository.port";

export interface IDeleteUser {
  deleteUser(id: string): Promise<void>;
}

export class DeleteUserUseCase implements IDeleteUser {
  constructor(private readonly userRepository: IUserRepository) {}

  async deleteUser(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    return result;
  }
}
