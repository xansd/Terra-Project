import { Injectable } from '@angular/core';
import { FilesTypes, IFiles } from '../domain/files';
import config from '../../config/client.config';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  REQUIRED_FILE_TYPES = config.REQUIRED_FILE_TYPES;
  MAX_FILE_SIZE = config.MAX_FILE_SIZE;
  constructor() {}

  validateFileExtension(file: File) {
    const ext = file.name.substring(file.name.lastIndexOf('.') + 1);
    if (this.REQUIRED_FILE_TYPES.indexOf(ext) === -1) return false;
    return true;
  }

  validateSize(file: File) {
    if (this.MAX_FILE_SIZE === 0 || file.size <= this.MAX_FILE_SIZE)
      return true;
    return false;
  }

  createFileObject(file: File, type: FilesTypes) {
    const fileObject: IFiles = {
      type: type,
      name: file.name,
      file: file,
    };
    return fileObject;
  }

  /**
   * Devuelve un objeto File a partir de una imagen en base64
   * @param base64 imagen
   * @param fileName nombre fichero
   * @param fileType tipo de fichero
   * @returns {File}
   */
  dataURItoFile(base64: any, fileName: string, fileType: string): File {
    const byteString = window.atob(base64.toString().split(',')[1].trim());
    const int8Array = new Uint8Array(new ArrayBuffer(byteString.length));
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: fileType });

    return new File([blob], fileName, { type: fileType });
  }
}
