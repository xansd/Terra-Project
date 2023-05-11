import { Role } from "./roles.enum";
import { Email } from "./value-objects/email.value-object";
import { Password } from "./value-objects/password.value-object";
import { UserID } from "./value-objects/user-id.value-object";

export interface IUser {
  user_id?: UserID;
  email: Email;
  password?: Password;
  passwordHash?: string;
  role_id: Role;
  active?: boolean;
  password_last_reset?: string;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export class User implements IUser {
  user_id: UserID;
  email: Email;
  password?: Password;
  passwordHash?: string;
  role_id: Role;
  active?: boolean;
  password_last_reset?: string;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;

  private constructor(props: IUser) {
    this.user_id = props.user_id ? props.user_id : UserID.create();
    this.email = props.email;
    this.password = props.password;
    this.passwordHash = props.passwordHash;
    this.role_id = props.role_id;
    this.active = props.active || false;
    this.password_last_reset = props.password_last_reset;
    this.user_created = props.user_created;
    this.user_updated = props.user_updated;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
    this.deleted_at = props.deleted_at;
  }

  get _id(): UserID {
    return this.user_id;
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
    return this.role_id;
  }

  get _active(): boolean | undefined {
    return this.active;
  }

  get _lastReset(): string | undefined {
    return this.password_last_reset;
  }

  set _password(password: Password | undefined) {
    this.password = password;
  }

  set _role(role: Role) {
    this.role_id = role;
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
