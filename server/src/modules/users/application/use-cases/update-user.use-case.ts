import { IUserRepository } from "../../domain/user-repository.interface";
import { IUserDTO } from "../../infraestructure/user.dto";
import { UserAdapter } from "../user.adapter";

export interface IUpdateUser {
  updateUser(user: IUserDTO): Promise<void>;
}
export class UpdateUserUseCase implements IUpdateUser {
  userAdapter: UserAdapter = new UserAdapter();

  constructor(private readonly userRepository: IUserRepository) {}

  async updateUser(userDTO: IUserDTO): Promise<void> {
    const user = this.userAdapter.toDomain(userDTO);
    await this.userRepository.update(user);
  }
}
