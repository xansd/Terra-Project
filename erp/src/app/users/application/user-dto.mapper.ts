import { IDtoMapper } from '../../shared/infraestructure/api-mapper.interface';
import { Roles } from '../domain/roles';
import { IUser } from '../domain/user';
import { User } from '../domain/user';
import { Email } from '../domain/value-objects/email.value-object';
import { IUserPersistence } from './user.dto';

export class UserPersistenceMapper
  implements IPersistenceMapper<IUser, IUserPersistence>
{
  constructor() {}
  // Convierte un objeto de la base de datos a un dominio
  toDomain(persistence: IUserPersistence): IUser {
    const user_id = persistence.user_id;
    const email = Email.create(persistence.email);
    const passwordHash = persistence.passwordHash;
    const role = persistence.role_id === Roles.ADMIN ? Roles.ADMIN : Roles.USER;
    const active = persistence.active === 1 ? true : false;
    const lastReset = persistence.password_last_reset
      ? new Date(persistence.password_last_reset.replace(' ', 'T') + 'Z')
      : undefined;
    return User.create({
      id: user_id,
      email,
      passwordHash,
      role,
      active,
      lastReset,
    });
  }

  // Convierte un dominio a un objeto de la base de datos
  toPersistence(domain: IUser): IUserPersistence {
    const { id, email, passwordHash, role } = domain;
    return {
      user_id: id!.value,
      email: email.value,
      passwordHash: passwordHash,
      role_id: role === Role.ADMIN ? Role.ADMIN : Role.USER,
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
