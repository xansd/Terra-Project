import { Email } from "../../shared/domain/value-objects/email.value-object";
import { Role } from "./roles.enum";
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
    this.active = props.active;
    this.password_last_reset = props.password_last_reset;
    this.user_created = props.user_created;
    this.user_updated = props.user_updated;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
    this.deleted_at = props.deleted_at;
  }

  public static create(props: IUser): User {
    const user = new User(props);
    return user;
  }

  public static roleToString(role: Role): string {
    switch (role) {
      case Role.SYS:
        return "SYS";
      case Role.ADMIN:
        return "ADMIN";
      case Role.USER:
        return "USER";
      case Role.PARTNER:
        return "PARTNER";
      default:
        throw new Error("Invalid role");
    }
  }

  public static stringToRole(roleString: string): Role {
    switch (roleString) {
      case "SYS":
        return Role.SYS;
      case "ADMIN":
        return Role.ADMIN;
      case "USER":
        return Role.USER;
      case "PARTNER":
        return Role.PARTNER;
      default:
        throw new Error("Invalid role string");
    }
  }

  public static toUserID(id: string): UserID {
    return UserID.create(id);
  }
}
