import { ApiResponse } from "../../../shared/infraestructure/interfaces/api-response.interface";
import { IUserRepository } from "../../domain/repositories/user-repository.interface";
import { UserAdapter } from "../adapters";
import { IUserDTO } from "../dtos/user.dto";
import { IDeleteUser } from "../interfaces";

export class DeleteUserService implements IDeleteUser {
  private userAdapter: UserAdapter = new UserAdapter();
  constructor(private readonly userRepository: IUserRepository) {}

  async deleteUser(userDTO: IUserDTO): Promise<ApiResponse<IUserDTO | null>> {
    const user = this.userAdapter.toDomain(userDTO);
    const deletedUser = await this.userRepository.delete(user);

    return deletedUser
      ? {
          success: false,
          code: 400,
          message: "No ha sido posible eliminar el usuario",
          data: userDTO,
        }
      : {
          success: true,
          code: 201,
          message: "ok",
          data: deletedUser,
        };
  }
}
