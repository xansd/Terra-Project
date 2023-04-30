import { ApiResponse } from "../../../shared/infraestructure/interfaces/api-response.interface";
import { IUserRepository } from "../../domain/repositories/user-repository.interface";
import { IUserDTO } from "../dtos/user.dto";
import { IGetUser } from "../interfaces";

export class GetUserService implements IGetUser {
  constructor(private readonly userRepository: IUserRepository) {}

  async getUser(id: string): Promise<ApiResponse<IUserDTO | null>> {
    const user = await this.userRepository.getById(id);

    return user
      ? {
          success: false,
          code: 400,
          message: "El usuario no existe",
          data: user,
        }
      : {
          success: true,
          code: 201,
          message: "ok",
          data: user,
        };
  }
}
