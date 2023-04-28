import { Entity } from "../../../shared/domain/entities/entity";
import { UniqueEntityID } from "../../../shared/domain/entities/unique-entity-id";
import { IUser } from "../interfaces/user.interface";
import { Role } from "../enums/roles.enum";
import { Email } from "../value-objects/email.value-object";
import { Password } from "../value-objects/password.value-object";

export class User extends Entity<IUser> {
  public _props!: IUser;

  private constructor(props: IUser, id?: UniqueEntityID) {
    super(props, id);
  }

  get email(): Email {
    return this.props.email;
  }

  get password(): Password {
    return this.props.password ?? Password.create("");
  }

  get role(): Role {
    return this.props.role;
  }

  set role(role: Role) {
    this.props.role = role;
  }

  set password(password: Password) {
    this.props.password = password;
  }

  set email(email: Email) {
    this.props.email = email;
  }

  public static create(props: IUser, id?: UniqueEntityID): User {
    const user = new User(props, id);

    return user;
  }
}
