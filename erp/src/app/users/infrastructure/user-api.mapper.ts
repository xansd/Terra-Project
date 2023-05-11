import { IAPIMapper } from 'src/app/shared/infraestructure/api-mapper.interface';
import { IUser, User } from '../domain/user';
import { Email } from '../domain/value-objects/email.value-object';
import { Roles } from '../domain/roles';
import { IUserAPI } from './user.api';

export class UserAPIMapper implements IAPIMapper<IUser, IUserAPI> {
  constructor() {}
  // Convierte un objeto de la API a un dominio
  toDomain(api: IUserAPI): IUser {
    const user_id = api.user_id;
    const email = Email.create(api.email);
    const role_id = Object.values(Roles).includes(api.role_id)
      ? api.role_id
      : Roles.USER;
    const active = api.active == 1 ? true : false;
    const password_last_reset = api.password_last_reset;
    const user_created = api.user_created;
    const user_updated = api.user_updated;
    const created_at = api.created_at;
    const updated_at = api.updated_at;
    const deleted_at = api.deleted_at;

    return User.create({
      user_id: user_id,
      email,
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

  // Convierte un dominio a un objeto de la API
  toAPI(domain: IUser): IUserAPI {
    const { user_id, email, password, role_id } = domain;
    return {
      user_id: user_id || '',
      email: email.value,
      password: password?.value,
      role_id: role_id === Roles.ADMIN ? Roles.ADMIN : Roles.USER,
      active: domain.active ? 1 : 0,
      password_last_reset: domain.password_last_reset,
    };
  }

  // Convierte una lista de dominio a una lista de API
  toAPIList(domainList: IUser[]): IUserAPI[] {
    return domainList.map((user) => this.toAPI(user));
  }

  // Convierte una lista de API a una lista de dominio
  toDomainList(apiList: IUserAPI[]): IUser[] {
    return apiList.map((userAPI) => this.toDomain(userAPI));
  }
}
