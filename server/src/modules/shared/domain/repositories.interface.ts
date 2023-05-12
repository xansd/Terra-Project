import { Role } from "../../users/domain";
import { Email } from "../../users/domain/value-objects/email.value-object";

export interface IRepository<E> {
  getById(id: string): Promise<E>;
  getAll(): Promise<E[]>;
  create(
    user_id: string,
    email: string,
    passwordhash: string,
    role_id: number
  ): Promise<E>;
  update(entity: E): Promise<void>;
  delete(id: string): Promise<void>;
}
