import { Observable, tap } from 'rxjs';
import { IFiles, IFilesType } from '../domain/files';
import { Inject, Injectable } from '@angular/core';
import { IFilesAPIPort } from '../domain/files-api.port';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { FileService } from './files.service';

export interface IGetFile {
  getFile(fileId: string): Observable<IFiles>;
}

export interface IGetFiles {
  getFiles(entityId: string): Observable<IFiles[]>;
}

export interface IGetTypes {
  getTypes(): Observable<IFilesType[]>;
}

export interface IUploadFile {
  upload(formData: FormData): Observable<HttpEvent<void>>;
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

  getTypes(): Observable<IFilesType[]> {
    return this.filesAPI.getTypes();
  }

  upload(formData: FormData): Observable<HttpEvent<void>> {
    return this.filesAPI.uploadFile(formData).pipe(
      tap((event: HttpEvent<void>) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round((event.loaded / event.total!) * 100);
        }
      })
    );
  }

  downloadEntityFiles(entityid: string): Observable<IFiles[]> {
    return this.filesAPI.downloadEntityFiles(entityid);
  }

  deleteFile(fileId: string): Observable<void> {
    return this.filesAPI.deleteFile(fileId);
  }
}
