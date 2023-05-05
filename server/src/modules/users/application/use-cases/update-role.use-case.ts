import { IUserRepository } from "../../domain";
import { IUserDTO } from "../user.dto";
import { UserMapper } from "../user-dto.mapper";

export interface IUpdateRole {
  updateRole(user: IUserDTO, password: string): Promise<void>;
}

export class UpdateRoleUseCase implements IUpdateRole {
  userMapper = new UserMapper();
  constructor(private readonly userRepository: IUserRepository) {}
  async updateRole(userDTO: IUserDTO): Promise<void> {
    await this.userRepository.updateRole(this.userMapper.toDomain(userDTO));
  }
}
