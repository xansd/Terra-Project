import { ApiResponse } from "../../../shared/infraestructure/interfaces/api-response.interface";
import { IUserRepository } from "../../domain/repositories/user-repository.interface";
import { IUserDTO } from "../dtos/user.dto";
import { UserAdapter } from "../adapters/user.adapter";
import { ICreateUser } from "../interfaces";

export class CreateUserService implements ICreateUser {
  private userAdapter: UserAdapter = new UserAdapter();
  constructor(private readonly userRepository: IUserRepository) {}

  async createUser(userDTO: IUserDTO): Promise<ApiResponse<IUserDTO | null>> {
    const userExists = await this.userRepository.findByEmail(userDTO.email);
    const user = this.userAdapter.toDomain(userDTO);
    const createdUser = await this.userRepository.create(user);

    if (userExists || !createdUser) {
      return {
        success: false,
        code: 400,
        message: "No ha sido posible crear el usuario",
        data: userDTO
      };
    } else if (userExists && createdUser) {
      return {
        success: true,
        code: 201,
        message: "Usuario creado correctamente",
        data: createdUser,
      };
    }
}
