export interface ISanctions {
  sanction_id?: number;
  partner_id: string;
  severity: number;
  description: string;
  created_at?: string;
  updated_at?: string | null;
  deleted_at?: string | null;
  user_created?: string | null;
  user_updated?: string | null;
}
