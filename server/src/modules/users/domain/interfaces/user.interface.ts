import { Entity } from "../../../shared/domain/interfaces";
import { Role } from "../enums/roles.enum";
import { Email } from "../value-objects/email.value-object";
import { Password } from "../value-objects/password.value-object";

export interface IUser extends Entity<IUser> {
  email: Email;
  password?: Password;
  role: Role;
}
