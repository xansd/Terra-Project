import { IRepository } from "../../shared/domain/repositories.interface";
import { IUser } from "./user";

export interface IUserRepository extends IRepository<IUser> {
  findByEmail(email: string): Promise<IUser>;
  checkUserExistenceByEmail(email: string): Promise<boolean>;
  updatePassword(user: IUser): Promise<void>;
  updateRole(user: IUser): Promise<void>;
  activateUser(id: string): Promise<void>;
  blockUser(id: string): Promise<void>;
  getPasswordHistory(user_id: string): Promise<string[]>;
}
