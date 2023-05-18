import { Email } from "../../shared/domain/value-objects/email.value-object";
import { IPersistenceMapper } from "../../shared/infraestructure/persistence-mapper.interface";
import { IUser, Role } from "../domain";
import { User } from "../domain/user";
import { UserID } from "../domain/value-objects/user-id.value-object";
import { IUserPersistence } from "./user.persistence";

export class UserPersistenceMapper
  implements IPersistenceMapper<IUser, IUserPersistence>
{
  constructor() {}
  // Convierte un objeto de la base de datos a un dominio
  toDomain(persistence: IUserPersistence): IUser {
    const user_id = new UserID(persistence.user_id);
    const email = Email.create(persistence.email);
    const passwordHash = persistence.password;
    const role_id = persistence.role_id;
    const active = persistence.active === 1 ? true : false;
    const password_last_reset = persistence.password_last_reset;
    const user_created = persistence.user_created;
    const user_updated = persistence.user_updated;
    const created_at = persistence.created_at;
    const updated_at = persistence.updated_at;
    const deleted_at = persistence.deleted_at;
    return User.create({
      user_id: user_id,
      email,
      passwordHash,
      role_id,
      active,
      password_last_reset,
      user_created,
      user_updated,
      created_at,
      updated_at,
      deleted_at,
    });
  }

  // Convierte un dominio a un objeto de la base de datos
  toPersistence(domain: IUser): IUserPersistence {
    const { user_id, email, passwordHash, role_id } = domain;
    return {
      user_id: user_id!.value,
      email: email.value,
      passwordHash: passwordHash,
      role_id: role_id,
      active: domain.active ? 1 : 0,
    };
  }

  // Convierte una lista de dominio a una lista de DTO
  toPersistenceList(domainList: IUser[]): IUserPersistence[] {
    return domainList.map((user) => this.toPersistence(user));
  }

  // Convierte una lista de DTO a una lista de dominio
  toDomainList(persistenceList: IUserPersistence[]): IUser[] {
    return persistenceList.map((userPersistence) =>
      this.toDomain(userPersistence)
    );
  }
}
