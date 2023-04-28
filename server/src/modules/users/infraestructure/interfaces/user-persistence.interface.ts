export interface IUserPersistence {
  user_id: string;
  password?: string;
  email: string;
  role_id: number;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}
