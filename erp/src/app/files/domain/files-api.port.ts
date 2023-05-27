import { Observable } from 'rxjs';
import { IFiles, IFilesType } from './files';
import { HttpEvent } from '@angular/common/http';

export interface IFilesAPIPort {
  getFile(filesId: string): Observable<IFiles>;
  getFiles(entityId: string): Observable<IFiles[]>;
  getTypes(): Observable<IFilesType[]>;
  uploadFile(fformData: FormData): Observable<HttpEvent<void>>;
  deleteFile(fileId: string): Observable<void>;
  downloadEntityFiles(entityid: string): Observable<IFiles[]>;
}
