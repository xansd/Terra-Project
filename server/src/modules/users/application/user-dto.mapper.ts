import { IUser, User } from "../domain/user";
import { IUserDTO } from "./user.dto";
import { Email } from "../domain/value-objects/email.value-object";
import { Password } from "../domain/value-objects/password.value-object";
import { Role } from "../domain";
import { IDTOMapper } from "../../shared/application/dto-mapper.interface";
import { UserID } from "../domain/value-objects/user-id.value-object";

export class UserMapper implements IDTOMapper<IUser, IUserDTO> {
  constructor() {}
  // Convierte un DTO a un dominio
  toDomain(dto: IUserDTO): IUser {
    const id = UserID.create(dto.id);
    const email = Email.create(dto.email);
    const password = dto.password ? Password.create(dto.password) : undefined;
    const role = dto.role || Role.USER;
    const props = { id, email, password, role };
    return User.create(props);
  }

  // Convierte un dominio a un DTO
  toDTO(domain: IUser): IUserDTO {
    return {
      id: domain.id?.value,
      email: domain.email.value,
      role: domain.role,
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
