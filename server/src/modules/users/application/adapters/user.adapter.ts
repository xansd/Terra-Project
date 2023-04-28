import { User } from "../../domain/entities/user";
import { IUser } from "../../domain/interfaces/user.interface";
import { IUserDTO } from "../dtos/user.dto";
import { UniqueEntityID } from "../../../shared/domain/entities/unique-entity-id";
import { Email } from "../../domain/value-objects/email.value-object";
import { Password } from "../../domain/value-objects/password.value-object";
import { UUIDGenerator } from "../../infraestructure";
import { Entity } from "../../../shared/domain";
import { Role } from "../../domain";
import { IUserAdapter } from "../interfaces/user-adapter.interface";

export class UserAdapter implements IUserAdapter<Entity<IUser>, IUserDTO> {
  constructor() {}
  // Convierte un DTO a un dominio
  toDomain(dto: IUserDTO): Entity<IUser> {
    const uid = dto.id
      ? new UniqueEntityID(dto.id)
      : new UniqueEntityID("", new UUIDGenerator());
    const email = Email.create(dto.email);
    const password = dto.password ? Password.create(dto.password) : undefined;
    const role = dto.role || Role.USER;
    const props = { email, password, role };
    return User.create(props, uid);
  }

  // Convierte un dominio a un DTO
  toDTO(domain: Entity<IUser>): IUserDTO {
    return {
      id: domain._id?.value,
      email: domain.props.email.value,
      role: domain.props.role,
    };
  }

  // Convierte una lista de dominio a una lista de DTO
  toDTOList(domainList: Entity<IUser>[]): IUserDTO[] {
    return domainList.map((user) => this.toDTO(user));
  }

  // Convierte una lista de DTO a una lista de dominio
  toDomainList(dtoList: IUserDTO[]): Entity<IUser>[] {
    return dtoList.map((userDTO) => this.toDomain(userDTO));
  }
}
