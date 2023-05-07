import { IDTOMapper } from 'src/app/shared/application/dto-mapper.interface';
import { IUser } from '../domain/user';
import { User } from '../domain/user';
import { Email } from '../domain/value-objects/email.value-object';
import { Password } from '../domain/value-objects/password.value-object';
import { IUserDTO } from './user.dto';

export class UserDTOMapper implements IDTOMapper<IUser, IUserDTO> {
  constructor() {}
  // Convierte un objeto de la base de datos a un dominio
  toDomain(dto: IUserDTO): IUser {
    // const user_id = dto.id;
    const email = Email.create(dto.email);
    const password = dto.password ? Password.create(dto.password) : undefined;
    // const role = dto.role;
    // const active = dto.active;
    // const lastReset = dto.lastReset;
    return User.create({
      id: '',
      email,
      password,
      role: 0,
      active: false,
      lastReset: new Date(),
    });
  }

  // Convierte un dominio a un objeto de la base de datos
  toDTO(domain: IUser): IUserDTO {
    const { id, email, password, role, active, lastReset } = domain;
    return {
      id: domain.id,
      email: domain.email.value,
      password: undefined,
      role: domain.role,
      active: domain.active,
      lastReset: domain.lastReset,
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
