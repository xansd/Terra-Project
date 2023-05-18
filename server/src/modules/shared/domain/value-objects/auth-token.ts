import { IUser, Role } from "../../../users/domain";
import { UserID } from "../../../users/domain/value-objects/user-id.value-object";
import jwt from "jsonwebtoken";
import config from "../../../../config/app-config";
import { Email } from "./email.value-object";

export interface IPayload {
  id: UserID;
  email: Email;
  role: Role;
  HasToReset: boolean;
}

export type AuthToken = string;

export function createToken(user: IUser, hasToReset: boolean): AuthToken {
  return jwt.sign(
    {
      id: user.user_id!.value,
      email: user.email.value,
      role: user.role_id,
      hasToReset: hasToReset,
    },
    config.JWT_SECRET!,
    {
      expiresIn: config.TOKEN_EXPIRES_IN,
    }
  );
}

export function decodeToken(token: string): IPayload {
  return jwt.verify(token, config.JWT_SECRET!) as unknown as IPayload;
}
