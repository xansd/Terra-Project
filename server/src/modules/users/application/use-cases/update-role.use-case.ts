import { IUserRepository } from "../../domain";
import { IUserDTO } from "../../infraestructure/user.dto";
import { UserAdapter } from "../user.adapter";

export interface IUpdateRole {
  updateRole(user: IUserDTO, password: string): Promise<void>;
}

export class UpdateRoleUseCase implements IUpdateRole {
  userAdapter = new UserAdapter();
  constructor(private readonly userRepository: IUserRepository) {}
  async updateRole(userDTO: IUserDTO): Promise<void> {
    await this.userRepository.updateRole(this.userAdapter.toDomain(userDTO));
  }
}
