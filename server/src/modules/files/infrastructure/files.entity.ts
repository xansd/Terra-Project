import { FilePolicy } from "../domain/files";

export interface IFilesEntity {
  file_id?: string;
  file_name: string;
  document_url?: string;
  file_type_id: number;
  file?: File | Buffer;
  policy?: FilePolicy;
  reference_id?: string;
  created_at?: string;
  updated_at?: string;
}
