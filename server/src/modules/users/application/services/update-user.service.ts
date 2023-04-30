import { ApiResponse } from "../../../shared/infraestructure/interfaces/api-response.interface";
import { IUserRepository } from "../../domain/repositories/user-repository.interface";
import { UserAdapter } from "../adapters";
import { IUserDTO } from "../dtos/user.dto";
import { IUpdateUser } from "../interfaces";

export class UpdateUserService implements IUpdateUser {
  userAdapter: UserAdapter = new UserAdapter();

  constructor(private readonly userRepository: IUserRepository) {}

  async updateUser(userDTO: IUserDTO): Promise<ApiResponse<IUserDTO | null>> {
    const user = await this.userAdapter.toDomain(userDTO);
    const updatedUser = await this.userRepository.update(user);

    return updatedUser
      ? {
          success: true,
          code: 201,
          message: "ok",
          data: updatedUser,
        }
      : {
          success: false,
          code: 400,
          message: "No ha sido posible actualizar el usuario",
          data: userDTO,
        };
  }
}
