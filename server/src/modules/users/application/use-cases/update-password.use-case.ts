import { IUserRepository } from "../../domain";
import { IUserDTO } from "../../infraestructure/user.dto";
import { UserAdapter } from "../user.adapter";

export interface IUpdatePassword {
  updatePassword(user: IUserDTO, password: string): Promise<void>;
}

export class UpdatePasswordeUseCase implements IUpdatePassword {
  userAdapter = new UserAdapter();

  constructor(private readonly userRepository: IUserRepository) {}
  async updatePassword(userDTO: IUserDTO): Promise<void> {
    await this.userRepository.updatePassword(
      this.userAdapter.toDomain(userDTO)
    );
  }
}
