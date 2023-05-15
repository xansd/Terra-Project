import { IUserRepository, PasswordHistoryError } from "../../domain";
import { Password } from "../../domain/value-objects/password.value-object";

export interface IUpdatePassword {
  updatePassword(data: {
    id: string;
    password: string;
    isAdminAction?: boolean;
  }): Promise<void>;
}

export class UpdatePasswordeUseCase implements IUpdatePassword {
  validatedPassword: any;
  numberLastPasswordsToCheck = 5;

  constructor(private readonly userRepository: IUserRepository) {}

  async updatePassword(data: {
    id: string;
    password: string;
    isAdminAction?: boolean;
  }): Promise<void> {
    const passwordsHistory = await this.userRepository.getPasswordHistory(
      data.id
    );

    // Comprobar la validez del nuevo password
    if (data.isAdminAction) {
      // Si es un reseteo de admin se permite el password por defecto
      this.validatedPassword = Password.create(
        data.password,
        data.isAdminAction
      );
    } else this.validatedPassword = Password.create(data.password);

    // Comprobar que la nueva contraseña no coincide con los últimos hashes de contraseñas
    for (const historyPasswordHash of passwordsHistory.slice(
      0,
      this.numberLastPasswordsToCheck
    )) {
      const isMatch = await Password.validatePasswordHash(
        data.password,
        historyPasswordHash
      );
      if (isMatch) {
        throw new PasswordHistoryError();
      }
    }

    // Generar el hash de contraseña
    const passwordHash = await Password.genPasswordHash(data.password);

    // Actualizar el hash enla base de datos
    const result = await this.userRepository.updatePassword({
      id: data.id,
      newPassword: passwordHash,
    });
    return result;
  }
}
