import { IUserRepository } from "../../domain/user-repository.interface";
import { IUserDTO } from "../user.dto";
import { UserMapper } from "../user-dto.mapper";

export interface IUpdateUser {
  updateUser(user: IUserDTO): Promise<void>;
}
export class UpdateUserUseCase implements IUpdateUser {
  userMapper: UserMapper = new UserMapper();

  constructor(private readonly userRepository: IUserRepository) {}

  async updateUser(userDTO: IUserDTO): Promise<void> {
    const user = this.userMapper.toDomain(userDTO);
    await this.userRepository.update(user);
  }
}
