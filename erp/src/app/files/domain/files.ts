export type FilesId = string;

export enum FilesTypes {
  DNI = 1,
  IMAGE = 2,
  COVER = 3,
  ALTA = 4,
  CUOTA = 5,
  RECIBO = 6,
}

export interface IFilesType {
  file_type_id: number;
  name: string;
  description: string;
}

export enum FilePolicy {
  PRIVATE = 'private',
  PUBLIC = 'public',
}

export interface IFiles {
  file_id?: FilesId;
  name: string;
  url?: string;
  type: FilesTypes;
  file?: File | Uint8Array | Blob | any;
  policy?: FilePolicy;
  reference_id?: string;
  created_at?: string;
  updated_at?: string;
}

export class Files implements IFiles {
  file_id?: FilesId;
  name: string;
  url?: string;
  type: FilesTypes;
  file?: File | Uint8Array | Blob;
  policy?: FilePolicy;
  reference_id?: string;
  created_at?: string;
  updated_at?: string;

  private constructor(props: IFiles) {
    this.file_id = props.file_id;
    this.name = props.name;
    this.url = props.url;
    this.type = props.type;
    this.file = props.file;
    this.reference_id = props.reference_id;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  public static create(props: IFiles): IFiles {
    return new Files(props);
  }
}
