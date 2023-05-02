import { IPersistenceAdapter } from "../../shared/infraestructure/persistence-adapter.interface";
import { IUser, Role } from "../domain";
import { User } from "../domain/user";
import { Email } from "../domain/value-objects/email.value-object";
import { Password } from "../domain/value-objects/password.value-object";
import { UserID } from "../domain/value-objects/user-id.value-object";

export interface IUserPersistence {
  user_id: string;
  password?: string;
  passwordHash?: string;
  email: string;
  role_id: number;
  active?: number;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export class UserPersistenceAdapter
  implements IPersistenceAdapter<IUser, IUserPersistence>
{
  constructor() {}
  // Convierte un objeto de la base de datos a un dominio
  toDomain(persistence: IUserPersistence): IUser {
    const user_id = new UserID(persistence.user_id);
    const email = Email.create(persistence.email);
    const role = persistence.role_id === 1 ? Role.ADMIN : Role.USER;
    const active = persistence.active === 1 ? true : false;
    return User.create({
      id: user_id,
      email,
      role,
      active,
    });
  }

  // Convierte un dominio a un objeto de la base de datos
  toPersistence(domain: IUser): IUserPersistence {
    const { id, email, password, role } = domain;
    return {
      user_id: id!.value,
      email: email.value,
      password: password?.value,
      role_id: role === Role.ADMIN ? 1 : 2,
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
