import { ApiResponse } from "../../../shared";
import { IUserRepository } from "../../domain";
import { IUserDTO } from "../dtos";
import { IUpdatePassword } from "../interfaces";
import { UserAdapter } from "../adapters/user.adapter";

export class UpdatePasswordeService implements IUpdatePassword {
  userAdapter = new UserAdapter();

  constructor(private readonly userRepository: IUserRepository) {}
  async updatePassword(
    userDTO: IUserDTO
  ): Promise<ApiResponse<IUserDTO | null>> {
    const updatedUser = await this.userRepository.updatePassword(
      this.userAdapter.toDomain(userDTO)
    );
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
          message: "No se pudo actualizar la contraseña",
          data: userDTO,
        };
  }
}
