import { IDTOMapper } from 'src/app/shared/application/dto-mapper.interface';
import { IUser } from '../domain/user';
import { User } from '../domain/user';
import { Email } from '../domain/value-objects/email.value-object';
import { Password } from '../domain/value-objects/password.value-object';
import { IUserDTO } from './user.dto';

export class UserDTOMapper implements IDTOMapper<IUser, IUserDTO> {
  constructor() {}
  // Convierte un objeto DTO a un dominio
  toDomain(dto: IUserDTO): IUser {
    const user_id = dto.user_id;
    const email = Email.create(dto.email);
    const password = dto.password ? Password.create(dto.password) : undefined;
    const role_id = dto.role_id;
    const active = dto.active;
    // const password_last_reset = dto.password_last_reset;
    return User.create({
      user_id,
      email,
      password,
      role_id,
      active,
    });
  }

  // Convierte un dominio a un objeto DTO
  toDTO(domain: IUser): IUserDTO {
    const {
      user_id,
      email,
      password,
      role_id,
      active,
      password_last_reset,
      user_created,
      user_updated,
      created_at,
      updated_at,
      deleted_at,
    } = domain;
    return {
      user_id: domain.user_id,
      email: domain.email.value,
      password: undefined,
      role_id: domain.role_id,
      active: domain.active,
      password_last_reset: domain.password_last_reset,
      user_created: domain.user_created,
      user_updated: domain.user_updated,
      created_at: domain.created_at,
      updated_at: domain.updated_at,
      deleted_at: domain.deleted_at,
    };
  }

  // Convierte una lista de dominio a una lista de DTO
  toDTOList(domainList: IUser[]): IUserDTO[] {
    return domainList.map((user) => this.toDTO(user));
  }

  // Convierte una lista de DTO a una lista de dominio
  toDomainList(dtoList: IUserDTO[]): IUser[] {
    return dtoList.map((userDTO) => this.toDomain(userDTO));
  }
}
