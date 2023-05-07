import { IAPIMapper } from 'src/app/shared/infraestructure/api-mapper.interface';
import { IUser, User } from '../domain/user';
import { Email } from '../domain/value-objects/email.value-object';
import { IUserAPI } from './user.api';
import { Roles } from '../domain/roles';

export class UserPersistenceMapper implements IAPIMapper<IUser, IUserAPI> {
  constructor() {}
  // Convierte un objeto de la base de datos a un dominio
  toDomain(api: IUserAPI): IUser {
    const user_id = api.user_id;
    const email = Email.create(api.email);
    const role = Object.values(Roles).includes(api.role_id)
      ? api.role_id
      : Roles.USER;
    const active = api.active === 1 ? true : false;
    const lastReset = api.password_last_reset
      ? new Date(api.password_last_reset)
      : undefined;
    return User.create({
      id: user_id,
      email,
      role,
      active,
      lastReset,
    });
  }

  // Convierte un dominio a un objeto de la base de datos
  toPersistence(domain: IUser): IUserAPI {
    const { id, email, password, role } = domain;
    return {
      user_id: id || '',
      email: email.value,
      password: password?.value,
      role_id: role === Roles.ADMIN ? Roles.ADMIN : Roles.USER,
      active: domain.active ? 1 : 0,
    };
  }

  // Convierte una lista de dominio a una lista de DTO
  toPersistenceList(domainList: IUser[]): IUserAPI[] {
    return domainList.map((user) => this.toPersistence(user));
  }

  // Convierte una lista de DTO a una lista de dominio
  toDomainList(persistenceList: IUserAPI[]): IUser[] {
    return persistenceList.map((userPersistence) =>
      this.toDomain(userPersistence)
    );
  }
}
