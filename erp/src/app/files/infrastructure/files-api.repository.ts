import { Observable, map, tap } from 'rxjs';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import SERVER from '../../config/server.config';
import { IFilesAPIPort } from '../domain/files-api.port';
import { IFiles, IFilesType } from '../domain/files';
import { IFilesDTO } from './files.dto';
import { FilesDTOMapper } from './files.mapper';

const API_URI = SERVER.API_URI + '/files';

@Injectable({ providedIn: 'root' })
export class FilesAPIRepository implements IFilesAPIPort {
  fileMapper = new FilesDTOMapper();
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
      .get<IFilesDTO[]>(`${API_URI}/all/${entityId}`, {
        withCredentials: true,
      })
      .pipe(
        map((files: IFilesDTO[]) => this.filesDTOMapper.toDomainList(files))
      );
  }

  getTypes(): Observable<IFilesType[]> {
    return this.http.get<IFilesType[]>(`${API_URI}/details/types`, {
      withCredentials: true,
    });
  }

  uploadFile(formData: FormData): Observable<HttpEvent<void>> {
    //const fileDTO = this.filesDTOMapper.toDTO(file);
    return this.http
      .post<void>(`${API_URI}`, formData, {
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

  downloadEntityFiles(entityId: string): Observable<IFiles[]> {
    return this.http
      .get<IFilesDTO[]>(`${API_URI}/downloadFiles/${entityId}`, {
        withCredentials: true,
      })
      .pipe(
        map((files: IFilesDTO[]) => this.filesDTOMapper.toDomainList(files))
      );
  }

  deleteFile(fileId: string): Observable<void> {
    return this.http.delete<void>(`${API_URI}/${fileId}`, {
      withCredentials: true,
    });
  }
}
