import { Readable } from "nodemailer/lib/xoauth2";
import { IFiles, IFilesType } from "./files";

export interface IFilesRepository {
  getFile(filesId: string): Promise<IFiles>;
  getFiles(entityId: string): Promise<IFiles[]>;
  getTypes(): Promise<IFilesType[]>;
  uploadFile(file: IFiles): Promise<void>;
  deleteFile(fileId: string): Promise<void>;
}

export interface ILocalFileHandler {
  downloadFile(fileName: string): Promise<Buffer>;
  streamFile(localFilePath: string): Promise<Readable>;
}
