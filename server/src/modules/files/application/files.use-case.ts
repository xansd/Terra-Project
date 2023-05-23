import Logger from "../../../apps/utils/logger";
import { IFilesRepository } from "../domain/file.repository";
import { IFiles } from "../domain/files";
import { FileDoesNotExistError } from "../domain/files.exceptions";

export interface IGetFile {
  getFile(fileId: string): Promise<IFiles>;
}

export interface IGetFiles {
  getFiles(entityId: string): Promise<IFiles[]>;
}

export interface IUploadFile {
  uploadFile(file: IFiles): Promise<void>;
}

export interface IDeleteFile {
  deleteFile(fileId: string): Promise<void>;
}

export class FilesCaseUses
  implements IGetFile, IGetFiles, IUploadFile, IDeleteFile
{
  constructor(private readonly filesRepository: IFilesRepository) {}

  async getFile(fileId: string): Promise<IFiles> {
    const file = await this.filesRepository.getFile(fileId);
    if (!file) {
      Logger.error(`files-repository : getFile : ${FileDoesNotExistError}`);
      throw new FileDoesNotExistError("El fichero no existe");
    }
    return file;
  }

  async getFiles(entityId: string): Promise<IFiles[]> {
    const files = await this.filesRepository.getFiles(entityId);
    if (!files) {
      Logger.error(`files-repository : getFile : ${FileDoesNotExistError}`);
      throw new FileDoesNotExistError("El fichero no existe");
    }
    return files;
  }

  async uploadFile(file: IFiles): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async deleteFile(fileId: string): Promise<void> {
    const result = await this.filesRepository.deleteFile(fileId);
    return result;
  }
}
