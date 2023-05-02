import { Role } from "./roles.enum";
import { Email } from "./value-objects/email.value-object";
import { Password } from "./value-objects/password.value-object";
import { UserID } from "./value-objects/user-id.value-object";

export interface IUser {
  id?: UserID;
  email: Email;
  password?: Password;
  role: Role;
  active?: boolean;
}

export class User implements IUser {
  id: UserID;
  email: Email;
  password?: Password;
  role: Role;
  active?: boolean;

  private constructor(props: IUser) {
    this.id = props.id ? props.id : UserID.create();
    this.email = props.email;
    this.password = props.password;
    this.role = props.role;
    this.active = props.active || false;
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

  get _role(): Role {
    return this.role;
  }

  get _active(): boolean | undefined {
    return this.active;
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
