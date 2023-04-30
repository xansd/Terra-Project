import { ApiResponse } from "../../../shared/infraestructure/interfaces/api-response.interface";
import { IUserRepository } from "../../domain/repositories/user-repository.interface";
import { IUserDTO } from "../dtos/user.dto";
import { IGetAllUsers } from "../interfaces";

export class GetAllUsersService implements IGetAllUsers {
  constructor(private readonly userRepository: IUserRepository) {}

  async getAllUsers(): Promise<ApiResponse<IUserDTO[] | null>> {
    const users = await this.userRepository.getAll();

    return users
      ? {
          success: false,
          code: 400,
          message: "No hay usuarios registrados",
          data: users,
        }
      : {
          success: true,
          code: 201,
          message: "ok",
          data: users,
        };
  }
}
