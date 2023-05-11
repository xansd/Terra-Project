import { Role } from "../domain";

export interface IUserDTO {
  user_id?: string;
  email: string;
  password?: string;
  role_id: Role;
  active?: number | boolean;
  password_last_reset?: string;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}
