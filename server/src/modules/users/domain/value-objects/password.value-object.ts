import { ValueObject } from "../../../shared/domain/value-objects/value-object.";

export class Password extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(password: string): Password {
    // Validar que la contraseña tenga al menos 8 caracteres, que tenga letras mayúsculas, minúsculas, números, etc.
    // ...

    return new Password(password);
  }
}
