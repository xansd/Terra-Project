import { Role } from "../../users/domain";
import { Email } from "../../users/domain/value-objects/email.value-object";

export interface IRepository<E> {
  getById(id: string): Promise<E>;
  getAll(): Promise<E[]>;
  create(email: Email, passwordhash: string, role_id: Role): Promise<E>;
  update(entity: E): Promise<void>;
  delete(id: string): Promise<void>;
}
