import { DomainValidationError } from '../../../shared/domain/domain-validation.exception';
import { ValueObject } from '../../../shared/domain/value-objects/value-object';

export class Email extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(email: string): Email {
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    if (!email || !email.match(emailRegex)) {
      throw new DomainValidationError('Formato de email inválido');
    }
    return new Email(email);
  }
}
