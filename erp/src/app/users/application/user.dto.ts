import { Roles } from '../domain/roles';

export interface IUserDTO {
  id?: string;
  password?: string;
  email: string;
  role: Roles;
  lastReset?: Date;
  active?: boolean;
}
