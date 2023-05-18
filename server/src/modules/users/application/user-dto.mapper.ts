import { IUser, User } from "../domain/user";
import { IUserDTO } from "./user.dto";
import { Password } from "../domain/value-objects/password.value-object";
import { IDTOMapper } from "../../shared/application/dto-mapper.interface";
import { UserID } from "../domain/value-objects/user-id.value-object";
import { Email } from "../../shared/domain/value-objects/email.value-object";

export class UserMapper implements IDTOMapper<IUser, IUserDTO> {
  constructor() {}
  // Convierte un DTO a un dominio
  toDomain(dto: IUserDTO): IUser {
    const user_id = UserID.create(dto.user_id);
    const email = Email.create(dto.email);
    const password = dto.password ? Password.create(dto.password) : undefined;
    const role_id = dto.role_id;
    const props = { user_id, email, password, role_id };
    return User.create(props);
  }

  // Convierte un dominio a un DTO
  toDTO(domain: IUser): IUserDTO {
    return {
      user_id: domain.user_id?.value,
      email: domain.email.value,
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
