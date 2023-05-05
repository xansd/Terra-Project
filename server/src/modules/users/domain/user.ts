import { Role } from "./roles.enum";
import { Email } from "./value-objects/email.value-object";
import { Password } from "./value-objects/password.value-object";
import { UserID } from "./value-objects/user-id.value-object";

export interface IUser {
  id?: UserID;
  email: Email;
  password?: Password;
  passwordHash?: string;
  role: Role;
  active?: boolean;
  lastReset?: Date;
}

export class User implements IUser {
  id: UserID;
  email: Email;
  password?: Password;
  passwordHash?: string;
  role: Role;
  active?: boolean;
  lastReset?: Date;

  private constructor(props: IUser) {
    this.id = props.id ? props.id : UserID.create();
    this.email = props.email;
    this.password = props.password;
    this.passwordHash = props.passwordHash;
    this.role = props.role;
    this.active = props.active || false;
    this.lastReset = props.lastReset;
  }

  get _id(): UserID {
    return this.id;
  }

  get _email(): Email {
    return this.email;
  }

  get _password(): Password | undefined {
    return this.password;
  }

  get _passwordHash(): string | undefined {
    return this.passwordHash;
  }

  get _role(): Role {
    return this.role;
  }

  get _active(): boolean | undefined {
    return this.active;
  }

  get _lastReset(): Date | undefined {
    return this.lastReset;
  }

  set _password(password: Password | undefined) {
    this.password = password;
  }

  set _role(role: Role) {
    this.role = role;
  }

  set _email(email: Email) {
    this.email = email;
  }

  set _active(active: boolean | undefined) {
    this.active = active;
  }

  public static create(props: IUser): User {
    const user = new User(props);

    return user;
  }
}
