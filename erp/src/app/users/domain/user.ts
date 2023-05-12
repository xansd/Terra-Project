import { Email } from './value-objects/email.value-object';
import { Password } from './value-objects/password.value-object';
import { Roles } from './roles';

export interface IUser {
  user_id?: string;
  email: Email;
  password?: Password;
  role_id: Roles;
  password_last_reset?: string;
  active?: boolean;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export class User implements IUser {
  user_id?: string;
  email: Email;
  password?: Password;
  role_id: Roles;
  password_last_reset?: string;
  active?: boolean;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;

  private constructor(props: IUser) {
    this.user_id = props.user_id ? props.user_id : '';
    this.email = props.email;
    this.password = props.password;
    this.role_id = props.role_id;
    this.password_last_reset = props.password_last_reset;
    this.active = props.active;
    this.user_created = props.user_created;
    this.user_updated = props.user_updated;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
    this.deleted_at = props.deleted_at;
  }

  static create(props: IUser): User {
    return new User(props);
  }

  isLoggedIn(): boolean {
    return !!this.user_id;
  }

  // getUserName(): Email {
  //   return this.email;
  // }

  // getRole(): Roles {
  //   return this.role_id;
  // }

  // getLastReset(): string | undefined {
  //   return this.password_last_reset || undefined;
  // }

  // getUserID(): string | undefined {
  //   return this.user_id;
  // }

  static getRoleNameFromNumber(roleNumber: number): string {
    switch (roleNumber) {
      case Roles.SYS:
        return 'SYS';
      case Roles.ADMIN:
        return 'ADMIN';
      case Roles.USER:
        return 'USER';
      case Roles.PARTNER:
        return 'PARTNER';
      default:
        return 'SYS';
    }
  }

  static getRoleNumberFromName(roleName: string): Roles {
    switch (roleName) {
      case 'SYS':
        return 1;
      case 'ADMIN':
        return 2;
      case 'USER':
        return 3;
      case 'PARTNER':
        return 4;
      default:
        return 1;
    }
  }
}
