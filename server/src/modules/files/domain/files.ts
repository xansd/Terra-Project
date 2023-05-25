export type FilesId = string;

export enum FilesTypes {
  COVER = "COVER",
  IMAGE = "IMAGE",
  DNI = "DNI",
  ALTA = "ALTA",
  CUOTA = "CUOTA",
  RECIBO = "RECIBO",
}

export interface IFiles {
  file_id?: FilesId;
  name: string;
  url?: string;
  type: FilesTypes;
  file?: File | Buffer;
  is_public?: number | boolean;
  partner_id?: string;
  product_id?: string;
  provider_id?: string;
  created_at?: string;
  updated_at?: string;
}

export class Files implements IFiles {
  file_id?: FilesId;
  name: string;
  url?: string;
  type: FilesTypes;
  file?: File | Buffer;
  is_public?: number | boolean;
  partner_id?: string;
  product_id?: string;
  provider_id?: string;
  created_at?: string;
  updated_at?: string;

  private constructor(props: IFiles) {
    this.file_id = props.file_id;
    this.name = props.name;
    this.url = props.url;
    this.type = props.type;
    this.file = props.file;
    this.is_public = props.is_public;
    this.partner_id = props.partner_id;
    this.product_id = props.product_id;
    this.provider_id = props.provider_id;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  public static create(props: IFiles): IFiles {
    return new Files(props);
  }
}
