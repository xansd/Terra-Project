import { FilePolicy } from '../domain/files';

export interface IFilesDTO {
  file_id?: string;
  name: string;
  url?: string;
  type: number;
  file?: File | Uint8Array | Blob;
  policy?: FilePolicy;
  reference_id?: string;
  created_at?: string;
  updated_at?: string;
}
