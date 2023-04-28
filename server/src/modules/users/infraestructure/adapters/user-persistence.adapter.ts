import { IPersistenceAdapter } from "../../../shared";
import { Entity, UniqueEntityID } from "../../../shared/domain";
import { IUser, Role } from "../../domain";
import { User } from "../../domain/entities/user";
import { Email } from "../../domain/value-objects/email.value-object";
import { Password } from "../../domain/value-objects/password.value-object";
import { IUserPersistence } from "../interfaces/user-persistence.interface";

export class UserPersistenceAdapter
  implements IPersistenceAdapter<Entity<IUser>, IUserPersistence>
{
  constructor() {}
  // Convierte un objeto de la base de datos a un dominio
  toDomain(persistence: IUserPersistence): Entity<IUser> {
    const uid = persistence.user_id;
    const email = Email.create(persistence.email);
    const password = persistence.password
      ? Password.create(persistence.password)
      : undefined;
    const role = persistence.role_id as Role;
    return User.create({ email, password, role }, new UniqueEntityID(uid));
  }

  // Convierte un dominio a un objeto de la base de datos
  toPersistence(domain: Entity<IUser>): IUserPersistence {
    const { email, password, role } = domain.props;
    return {
      user_id: domain._id?.value,
      email: email.value,
      password: password?.value,
      role_id: role,
    };
  }

  // Convierte una lista de dominio a una lista de DTO
  toPersistenceList(domainList: Entity<IUser>[]): IUserPersistence[] {
    return domainList.map((user) => this.toPersistence(user));
  }

  // Convierte una lista de DTO a una lista de dominio
  toDomainList(persistenceList: IUserPersistence[]): Entity<IUser>[] {
    return persistenceList.map((userPersistence) =>
      this.toDomain(userPersistence)
    );
  }
}
