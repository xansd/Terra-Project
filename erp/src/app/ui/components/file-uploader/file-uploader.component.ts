import { Component } from '@angular/core';
import { FileService } from 'src/app/files/application/files.service';
import { FilesUseCases } from 'src/app/files/application/files.use-cases';

import config from '../../../config/client.config';
import { FilesTypes, IFiles } from 'src/app/files/domain/files';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ErrorHandlerService } from 'src/app/shared/error/error-handler';
import { FilesDTOMapper } from 'src/app/files/infrastructure/files.mapper';
import {
  InvalidFileExtensionError,
  InvalidFileSizeError,
} from 'src/app/files/domain/files.exceptions';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent {
  REQUIRED_FILE_TYPES = config.REQUIRED_FILE_TYPES;
  defaultImage = config.DEFAULT_IMAGE;
  preview: any = [];
  files: any = [];
  progress: number[] = [];
  fileMapper = new FilesDTOMapper();
  constructor(
    private fileService: FileService,
    private filesUseCase: FilesUseCases,
    private notifier: NotificationAdapter,
    private errorHandler: ErrorHandlerService
  ) {}

  async onFileSelect(event: Event): Promise<void> {
    try {
      const target = event.target as HTMLInputElement;
      if (target.files) {
        const fileList = Array.from(target.files);
        for (const file of fileList) {
          if (file) {
            if (this.validateFile(file)) {
              const fileAsData = await this.fileService.readFile(file);
              // Guardamos la imagen en this.images (renderizado)
              this.preview.push(fileAsData);
              // Creamos un objeto Files y lo añadimos a this.files
              this.files.push(
                this.fileService.createFileObject(file, FilesTypes.ALTA, 'id')
              );
            }
          }
        }
      }
    } catch (error) {
      this.errorHandler.handleUnkonwError(error as unknown as Error);
    }
  }

  validateFile(file: File): boolean {
    if (!this.fileService.validateFileExtension(file)) {
      this.errorHandler.handleDomainError({
        message: `Fichero "${file.name}" con formato incorrecto. Selección anulada`,
      } as Error);
      return false;
    }
    // Size validation
    if (!this.fileService.validateFileSize(file)) {
      this.errorHandler.handleDomainError({
        message: `${file?.name}" supera el tamaño máximo permitido (10MB). Selección anulada`,
      } as Error);
      return false;
    }
    return true;
  }

  uploadFiles() {
    for (let i = 0; i < this.files!.length; i++) {
      this.uploadFile(i);
    }
  }

  uploadFile(i: number) {
    const formData = this.fileMapper.toFormData(this.files[i]);
    this.filesUseCase.upload(formData).subscribe({
      next: (event: HttpEvent<void>) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress[i] = Math.round((event.loaded / event.total!) * 100);
        }
      },
      error: (error: any) => {
        if (error instanceof InvalidFileExtensionError) {
          this.errorHandler.handleDomainError({
            message: 'Extensión no válida',
          } as Error);
        } else if (error instanceof InvalidFileSizeError) {
          this.errorHandler.handleDomainError({
            message: 'Tamaño no válido',
          } as Error);
        } else this.errorHandler.handleUnkonwError(error);
      },
    });
  }

  deleteFiles(i?: number): void {
    if (i) this.files.splice(i, 1);
    else this.files = [];
  }
}
