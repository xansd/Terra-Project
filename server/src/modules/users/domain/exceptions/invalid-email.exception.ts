import { DomainException } from "../../../shared/domain/exceptions/domain.exception";

export class InvalidEmailException extends DomainException {
  constructor(email: string) {
    super(`El email ${email} no es válido`);
  }
}
