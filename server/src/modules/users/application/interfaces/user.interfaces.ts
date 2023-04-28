import { ApiResponse } from "../../../shared/infraestructure/interfaces/api-response.interface";
import { IUserDTO } from "../dtos/user.dto";

export interface GetUser {
  getUser(id: string): Promise<ApiResponse<IUserDTO | null>>;
}

export interface GetAllUsers {
  getAllUsers(id: string): Promise<ApiResponse<IUserDTO | null>>;
}

export interface ICreateUser {
  createUser(user: IUserDTO): Promise<ApiResponse<IUserDTO | null>>;
}

export interface UpdateUser {
  updateUser(id: string, user: IUserDTO): Promise<ApiResponse<IUserDTO | null>>;
}

export interface IUpdatePassword {
  updatePassword(
    id: string,
    password: string
  ): Promise<ApiResponse<IUserDTO | null>>;
}

export interface IDeleteUser {
  deleteUser(id: string): Promise<ApiResponse<IUserDTO | null>>;
}
