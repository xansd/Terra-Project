import Logger from "../../../apps/utils/logger";
import { IFilesRepository } from "../domain/file.repository";
import { IFiles, IFilesType } from "../domain/files";
import { FileDoesNotExistError } from "../domain/files.exceptions";
import FileUploader from "../infrastructure/aws-storage.repository";
import { FilesMapper } from "../infrastructure/files.mapper";

export interface IGetFile {
  getFile(fileId: string): Promise<IFiles>;
}

export interface IGetFiles {
  getFiles(entityId: string): Promise<IFiles[]>;
}

export interface IDownloadFiles {
  downloadFiles(entityId: string): Promise<IFiles[]>;
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
      throw new FileDoesNotExistError();
    }
    return file;
  }

  async getTypes(): Promise<IFilesType[]> {
    const types = await this.filesRepository.getTypes();
    return types;
  }

  async getFiles(entityId: string): Promise<IFiles[]> {
    const files = await this.filesRepository.getFiles(entityId);
    if (!files) {
      Logger.error(`files-repository: getFiles: ${FileDoesNotExistError}`);
      throw new FileDoesNotExistError();
    }
    return files;
  }

  async downloadFiles(entityId: string): Promise<IFiles[]> {
    const fileUploader = new FileUploader();
    const fileMapper = new FilesMapper();
    const files = await this.filesRepository.getFiles(entityId);
    if (!files) {
      Logger.error(`files-repository: getFiles: ${FileDoesNotExistError}`);
      throw new FileDoesNotExistError();
    }

    // Encapsulamos el fichero en cada objeto IFiles
    const updatedFiles: IFiles[] = [];

    for (const file of files) {
      const key = file.url;
      const fileData = await fileUploader.downloadFile(key!);
      const updatedFile = await fileMapper.createIFilesFromStream(
        fileData,
        file
      );
      updatedFiles.push(updatedFile);
    }

    return updatedFiles;
  }

  async downloadFile(fileId: string): Promise<IFiles> {
    const fileUploader = new FileUploader();
    const fileMapper = new FilesMapper();
    const file = await this.filesRepository.getFile(fileId);
    if (!file) {
      Logger.error(`files-repository: getFiles: ${FileDoesNotExistError}`);
      throw new FileDoesNotExistError();
    }
    const key = file.url;
    const fileData = await fileUploader.downloadFile(key!);
    const updatedFile = await fileMapper.createIFilesFromStream(fileData, file);

    return updatedFile;
  }

  async uploadFile(file: IFiles): Promise<void> {
    const uploader = new FileUploader();
    const url = uploader.getDocumentKey();
    file.url = url;
    const result = await this.filesRepository.uploadFile(file);
    return result;
  }

  async deleteFile(fileId: string): Promise<void> {
    const result = await this.filesRepository.deleteFile(fileId);
    return result;
  }
}
