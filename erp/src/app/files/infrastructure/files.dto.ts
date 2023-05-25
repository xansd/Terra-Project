export interface IFilesDTO {
  file_id?: string;
  name: string;
  url?: string;
  type: string;
  file?: File | Uint8Array;
  is_public?: number | boolean;
  partner_id?: string;
  product_id?: string;
  provider_id?: string;
  created_at?: string;
  updated_at?: string;
}
