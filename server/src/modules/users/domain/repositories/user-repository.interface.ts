import { Entity } from "../../../shared/domain";
import { IRepository } from "../../../shared/domain/repositories/repositories.interface";
import { IUserDTO } from "../../application";
import { IUser } from "../interfaces/user.interface";

export interface IUserRepository extends IRepository<Entity<IUser>, IUserDTO> {
  findByEmail(email: string): Promise<IUserDTO | null>;
  updatePassword(
    user: Entity<IUser>,
    password: string
  ): Promise<IUserDTO | null>;
}
