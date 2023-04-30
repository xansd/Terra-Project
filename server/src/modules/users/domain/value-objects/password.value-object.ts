import { ValueObject } from "../../../shared/domain/value-objects/value-object.";
import { InvalidPasswordException } from "../exceptions";

export class Password extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(password: string): Password {
    const passwordMinLength = 10;
    const passwordMaxLength = 24;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&_-])/;

    if (password.length < passwordMinLength) {
      throw new InvalidPasswordException(
        `El password debe tener como mínimo ${passwordMinLength} caracteres`
      );
    }
    if (password.length > passwordMaxLength) {
      throw new InvalidPasswordException(
        `El password debe tener como máximo ${passwordMaxLength} caracteres`
      );
    }
    if (!password.match(passwordRegex)) {
      throw new InvalidPasswordException(
        "El password debe contener como mínimo una letra minúscula, una mayúscula, y un caracter especial de entre los siguentes: !@#$%^&_-*"
      );
    }

    return new Password(password);
  }
}
