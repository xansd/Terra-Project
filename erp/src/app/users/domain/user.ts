import { Email } from './value-objects/email.value-object';
import { Password } from './value-objects/password.value-object';
import { Roles } from './roles';

export interface IUser {
  id?: string;
  email: Email;
  password?: Password;
  role: Roles;
  lastReset?: Date;
  active?: boolean;
}

export class User implements IUser {
  id?: string;
  email: Email;
  password?: Password;
  role: Roles;
  lastReset?: Date;
  active?: boolean;

  private constructor(props: IUser) {
    this.email = props.email;
    this.password = props.password;
    this.role = props.role;
    this.lastReset = props.lastReset;
    this.active = props.active;
  }

  static create(props: IUser): User {
    return new User(props);
  }

  isLoggedIn(): boolean {
    return !!this.id;
  }

  getUserName(): Email {
    return this.email;
  }

  getRole(): Roles {
    return this.role;
  }

  getLastReset(): Date | undefined {
    return this.lastReset || undefined;
  }

  getUserID(): string | undefined {
    return this.id;
  }
}
