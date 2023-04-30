import { ApiResponse } from "../../../shared/infraestructure/interfaces/api-response.interface";
import { IUserDTO } from "../dtos/user.dto";

export interface IGetUser {
  getUser(id: string): Promise<ApiResponse<IUserDTO | null>>;
}

export interface IGetAllUsers {
  getAllUsers(id: string): Promise<ApiResponse<IUserDTO[] | null>>;
}

export interface ICreateUser {
  createUser(user: IUserDTO): Promise<ApiResponse<IUserDTO | null>>;
}

export interface IUpdateUser {
  updateUser(user: IUserDTO): Promise<ApiResponse<IUserDTO | null>>;
}

export interface IUpdatePassword {
  updatePassword(
    user: IUserDTO,
    password: string
  ): Promise<ApiResponse<IUserDTO | null>>;
}

export interface IDeleteUser {
  deleteUser(id: IUserDTO): Promise<ApiResponse<IUserDTO | null>>;
}

export interface IActivateUser {
  activateUser(id: IUserDTO): Promise<ApiResponse<IUserDTO | null>>;
  blockUser(id: IUserDTO): Promise<ApiResponse<IUserDTO | null>>;
}
