import { Observable } from 'rxjs';
import { IFiles } from '../domain/files';
import { Inject, Injectable } from '@angular/core';
import { IFilesAPIPort } from '../domain/files-api.port';
import { HttpEvent } from '@angular/common/http';
import { FileService } from './files.service';
import {
  InvalidFileExtensionError,
  InvalidFileSizeError,
} from '../domain/files.exceptions';

export interface IGetFile {
  getFile(fileId: string): Observable<IFiles>;
}

export interface IGetFiles {
  getFiles(entityId: string): Observable<IFiles[]>;
}

export interface IUploadFile {
  upload(file: IFiles): Observable<HttpEvent<void>>;
}

export interface IDeleteFile {
  deleteFile(fielId: string): Observable<void>;
}

@Injectable({
  providedIn: 'root',
})
export class FilesUseCases
  implements IGetFile, IGetFiles, IUploadFile, IDeleteFile
{
  constructor(
    @Inject('filesAPI') private readonly filesAPI: IFilesAPIPort,
    private filesService: FileService
  ) {}
  getFile(fileId: string): Observable<IFiles> {
    return this.filesAPI.getFile(fileId);
  }
  getFiles(entityId: string): Observable<IFiles[]> {
    return this.filesAPI.getFiles(entityId);
  }
  upload(file: IFiles): Observable<HttpEvent<void>> {
    const isSizeValid = this.filesService.validateSize(file.file!);
    const isExtensionValid = this.filesService.validateFileExtension(
      file.file!
    );

    if (!isSizeValid) throw new InvalidFileSizeError();
    if (!isExtensionValid) throw new InvalidFileExtensionError();

    return this.filesAPI.uploadFile(file);
  }
  deleteFile(fielId: string): Observable<void> {
    return this.filesAPI.deleteFile(fielId);
  }
}
