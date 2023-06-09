import { Injectable } from '@angular/core';
import { FilePolicy, FilesTypes, IFiles } from '../domain/files';
import config from '../../config/client.config';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  MIME_TYPES = config.MIME_TYPES;
  private mimeTypes: { [key: string]: string } = this.MIME_TYPES;

  REQUIRED_FILE_TYPES = config.REQUIRED_FILE_TYPES;
  REQUIRED_FILE_IMAGE_TYPES = config.REQUIRED_FILE_IMAGE_TYPES;
  MAX_FILE_SIZE = config.MAX_FILE_SIZE;
  constructor() {}

  validateFileExtension(file: File) {
    const ext = file.name.substring(file.name.lastIndexOf('.') + 1);
    if (this.REQUIRED_FILE_TYPES.indexOf(ext) === -1) return false;
    return true;
  }

  validateFileImageExtension(file: File) {
    const ext = file.name.substring(file.name.lastIndexOf('.') + 1);
    if (this.REQUIRED_FILE_IMAGE_TYPES.indexOf(ext) === -1) return false;
    return true;
  }

  validateFileSize(file: File) {
    if (this.MAX_FILE_SIZE === 0 || file.size <= this.MAX_FILE_SIZE)
      return true;
    return false;
  }

  createFileObject(
    file: File,
    type: FilesTypes,
    referenceId: string,
    policy?: FilePolicy
  ) {
    const fileObject: IFiles = {
      name: file.name,
      type: type,
      file: file,
      reference_id: referenceId,
      policy: policy ? policy : FilePolicy.PRIVATE,
    };
    return fileObject;
  }

  readFile(file: File | undefined): Promise<any> {
    return new Promise((resolve, reject) => {
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.onerror = () => {
          reject(reader.error);
        };
      }
    });
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

  bufferToFile(buffer: Uint8Array, fileName: string): File {
    const byteArray = new Uint8Array(buffer);
    const mimeType = this.getMimeTypeFromExtension(fileName);
    const file = new File([byteArray], fileName, { type: mimeType });
    return file;
  }

  getMimeTypeFromExtension(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    if (extension && this.mimeTypes.hasOwnProperty(extension)) {
      return this.mimeTypes[extension];
    }
    return '';
  }

  isImage(file: File): boolean {
    return file.type.startsWith('image/');
  }
}
