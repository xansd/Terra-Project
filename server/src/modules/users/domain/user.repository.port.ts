import { Role } from "./roles.enum";
import { IUser } from "./user";

export interface IUserRepository {
  getById(id: string): Promise<IUser>;
  getAll(): Promise<IUser[]>;
  create(
    user_id: string,
    email: string,
    passwordhash: string,
    role_id: number
  ): Promise<IUser>;
  delete(id: string): Promise<void>;
  findByEmail(email: string): Promise<IUser>;
  checkUserExistenceByEmail(email: string): Promise<boolean>;
  updatePassword(data: { id: string; newPassword: string }): Promise<void>;
  updateRole(id: string, role: Role): Promise<void>;
  activateUser(id: string): Promise<void>;
  blockUser(id: string): Promise<void>;
  getPasswordHistory(user_id: string): Promise<string[]>;
}
