import { Observable, map, tap } from 'rxjs';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import SERVER from '../../config/server.config';
import { IFilesAPIPort } from '../domain/files-api.port';
import { IFiles } from '../domain/files';
import { IFilesDTO } from './files.dto';
import { FilesDTOMapper } from './files.mapper';

const API_URI = SERVER.API_URI + '/files';

@Injectable({ providedIn: 'root' })
export class FilesAPIRepository implements IFilesAPIPort {
  progress = 0;
  private readonly filesDTOMapper: FilesDTOMapper;

  constructor(private http: HttpClient) {
    this.filesDTOMapper = new FilesDTOMapper();
  }
  getFile(filesId: string): Observable<IFiles> {
    return this.http
      .get<IFilesDTO>(`${API_URI}/${filesId}`, {
        withCredentials: true,
      })
      .pipe(map((file: IFilesDTO) => this.filesDTOMapper.toDomain(file)));
  }

  getFiles(entityId: string): Observable<IFiles[]> {
    return this.http
      .get<IFilesDTO[]>(`${API_URI}/${entityId}`, {
        withCredentials: true,
      })
      .pipe(
        map((files: IFilesDTO[]) => this.filesDTOMapper.toDomainList(files))
      );
  }

  uploadFile(file: IFiles): Observable<HttpEvent<void>> {
    return this.http
      .post<void>(`${API_URI}`, file, {
        observe: 'events',
        reportProgress: true,
      })
      .pipe(
        tap((event: HttpEvent<void>) => {
          if (event.type === HttpEventType.UploadProgress) {
            // Calcula el progreso en porcentaje
            this.progress = Math.round((event.loaded / event.total!) * 100);
          }
        })
      );
  }

  downloadEntityFiles(entityid: string): Observable<IFiles[]> {
    throw new Error('Method not implemented.');
  }

  deleteFile(fileId: string): Observable<void> {
    return this.http.delete<void>(`${API_URI}/${fileId}`, {
      withCredentials: true,
    });
  }
}
