import { Observable, tap } from 'rxjs';
import { IFiles } from '../domain/files';
import { Inject, Injectable } from '@angular/core';
import { IFilesAPIPort } from '../domain/files-api.port';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { FileService } from './files.service';
import {
  FileDoesNotExistError,
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
  upload(file: any): Observable<HttpEvent<void>>;
}

export interface IDeleteFile {
  deleteFile(fielId: string): Observable<void>;
}

export interface IUploadFile {
  downloadEntityFiles(entityid: string): Observable<IFiles[]>;
}

@Injectable({
  providedIn: 'root',
})
export class FilesUseCases
  implements IGetFile, IGetFiles, IUploadFile, IDeleteFile
{
  progress: number = 0;

  constructor(
    @Inject('filesAPI') private readonly filesAPI: IFilesAPIPort,
    @Inject('fileService') private filesService: FileService
  ) {}
  getFile(fileId: string): Observable<IFiles> {
    return this.filesAPI.getFile(fileId);
  }
  getFiles(entityId: string): Observable<IFiles[]> {
    return this.filesAPI.getFiles(entityId);
  }
  upload(file: any): Observable<HttpEvent<void>> {
    if (!file) throw new FileDoesNotExistError('file not found');
    const isExtensionValid = this.filesService.validateFileExtension(file.name);
    if (!isExtensionValid) throw new InvalidFileExtensionError(file.name);
    const isSizeValid = this.filesService.validateFileSize(file.size);
    if (!isSizeValid) throw new InvalidFileSizeError(file.name);

    return this.filesAPI.uploadFile(file).pipe(
      tap((event: HttpEvent<void>) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round((event.loaded / event.total!) * 100);
        }
      })
    );
  }

  downloadEntityFiles(entityid: string): Observable<IFiles[]> {
    throw new Error('Method not implemented.');
  }

  deleteFile(fileId: string): Observable<void> {
    return this.filesAPI.deleteFile(fileId);
  }
}
