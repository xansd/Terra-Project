import { FilePolicy } from '../domain/files';

export interface IFilesDTO {
  file_id?: string;
  name: string;
  url?: string;
  type: string;
  file?: File | Uint8Array | Blob;
  is_public?: number | boolean;
  policy?: FilePolicy;
  reference_id?: string;
  created_at?: string;
  updated_at?: string;
}
