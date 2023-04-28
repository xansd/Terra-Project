import { Role } from "../../domain";

export interface IUserDTO {
  id?: string;
  password?: string;
  email: string;
  role: Role;
}
