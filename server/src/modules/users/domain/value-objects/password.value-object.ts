import bcrypt from "bcryptjs";
import config from "../../../../config/app-config";
import { ValueObject } from "../../../shared/domain/value-objects/value-object";
import { DomainValidationError } from "../../../shared/domain/domain-validation.exception";

export class Password extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(password: string): Password {
    const passwordMinLength = 10;
    const passwordMaxLength = 24;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&_-])/;

    if (password.length < passwordMinLength) {
      throw new DomainValidationError(
        `El password debe tener como mínimo ${passwordMinLength} caracteres`
      );
    }
    if (password.length > passwordMaxLength) {
      throw new DomainValidationError(
        `El password debe tener como máximo ${passwordMaxLength} caracteres`
      );
    }
    if (!password.match(passwordRegex)) {
      throw new DomainValidationError(
        "El password debe contener como mínimo una letra minúscula, una mayúscula, y un caracter especial de entre los siguentes: !@#$%^&_-*"
      );
    }

    return new Password(password);
  }

  public static createFromPersistence(password: string): Password {
    return new Password(password);
  }

  public static async genPasswordHash(userPassword: string) {
    return await bcrypt.hash(userPassword, config.SALT);
  }

  public static async validatePasswordHash(userPassword: string, hash: string) {
    return await bcrypt.compare(userPassword, hash);
  }
}
