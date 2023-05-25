export interface IFilesEntity {
  file_id?: string;
  file_name: string;
  document_url?: string;
  file_type_id: number;
  file?: File | Buffer;
  is_public?: number | boolean;
  reference_id?: string;
  created_at?: string;
  updated_at?: string;
}
