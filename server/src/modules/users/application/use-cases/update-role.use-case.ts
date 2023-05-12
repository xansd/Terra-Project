import { IUserRepository, Role } from "../../domain";
import { UserMapper } from "../user-dto.mapper";

export interface IUpdateRole {
  updateRole(id: string, role: Role): Promise<void>;
}

export class UpdateRoleUseCase implements IUpdateRole {
  userMapper = new UserMapper();
  constructor(private readonly userRepository: IUserRepository) {}
  async updateRole(id: string, role: Role): Promise<void> {
    const result = await this.userRepository.updateRole(id, role);
    return result;
  }
}
