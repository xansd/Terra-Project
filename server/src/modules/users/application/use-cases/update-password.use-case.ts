import { IUserRepository, PasswordHistoryError } from "../../domain";
import { Password } from "../../domain/value-objects/password.value-object";
import { IUserDTO } from "../user.dto";
import { UserMapper } from "../user-dto.mapper";

export interface IUpdatePassword {
  updatePassword(user: IUserDTO, password: string): Promise<void>;
}

export class UpdatePasswordeUseCase implements IUpdatePassword {
  userMapper = new UserMapper();
  numberLastPasswordsToCheck = 5;

  constructor(private readonly userRepository: IUserRepository) {}

  async updatePassword(userDTO: IUserDTO): Promise<void> {
    const user = this.userMapper.toDomain(userDTO);
    const passwordsHistory = await this.userRepository.getPasswordHistory(
      user.user_id?.value!
    );

    // Comprobar que la nueva contraseña no coincide con los últimos hashes de contraseñas
    for (const historyPasswordHash of passwordsHistory.slice(
      0,
      this.numberLastPasswordsToCheck
    )) {
      const isMatch = await Password.validatePasswordHash(
        user.password?.value!,
        historyPasswordHash
      );
      if (isMatch) {
        throw new PasswordHistoryError();
      }
    }

    // Actualizar la contraseña
    const passwordHash = await Password.genPasswordHash(user.password?.value!);
    user.passwordHash = passwordHash;

    const result = await this.userRepository.updatePassword(user);
    return result;
  }
}
