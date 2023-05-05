export interface IUserPersistence {
  user_id: string;
  password?: string;
  passwordHash?: string;
  email: string;
  role_id: number;
  active?: number;
  password_last_reset?: string;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}
