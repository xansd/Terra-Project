import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FileService } from 'src/app/files/application/files.service';
import { FilesUseCases } from 'src/app/files/application/files.use-cases';

import config from '../../../config/client.config';
import { FilePolicy, IFilesType } from 'src/app/files/domain/files';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ErrorHandlerService } from 'src/app/shared/error/error-handler';
import { FilesDTOMapper } from 'src/app/files/infrastructure/files.mapper';
import {
  InvalidFileExtensionError,
  InvalidFileSizeError,
} from 'src/app/files/domain/files.exceptions';
import { AppStateService, FormMode } from '../../services/app-state.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalActions } from '../../shared/enums/modalActions.enum';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Subject, take, takeUntil } from 'rxjs';
import { PageRoutes } from '../../pages/pages-info.config';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent implements OnInit, OnDestroy {
  @Input('isUploaderEnabled') isUploaderEnabled!: boolean;
  @Input('modalRef') modalRef!: NgbActiveModal;
  @Output() closeModal: EventEmitter<ModalActions> =
    new EventEmitter<ModalActions>();
  @ViewChild('inputFile') inputFileRef!: ElementRef<HTMLInputElement>;
  REQUIRED_FILE_TYPES = config.REQUIRED_FILE_TYPES;
  defaultImage = config.DEFAULT_IMAGE;
  preview: any = [];
  files: any = [];
  progress: number[] = [];
  fileMapper = new FilesDTOMapper();
  modalActions = ModalActions;
  documentTypes: IFilesType[] = [];

  uploaderForm: UntypedFormGroup = this.formBuilder.group({
    documentType: [1, [Validators.required]],
    files: [],
  });
  private destroy$ = new Subject();

  constructor(
    private fileService: FileService,
    private filesUseCase: FilesUseCases,
    private notifier: NotificationAdapter,
    private appState: AppStateService,
    private errorHandler: ErrorHandlerService,
    private formBuilder: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.getFormMode() === FormMode.UPDATE
      ? (this.isUploaderEnabled = true)
      : (this.isUploaderEnabled = false);
    this.getDocumentsType();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getDocumentsType(): void {
    this.filesUseCase
      .getTypes()
      .pipe(take(1))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (types: IFilesType[]) => {
          this.documentTypes = types;
        },
      });
  }

  getFormMode(): string {
    return this.appState.state.formMode;
  }

  async onFileSelect(event: Event): Promise<void> {
    try {
      const entityId = this.appState.state.activeEntityID;
      const target = event.target as HTMLInputElement;
      if (target.files) {
        const fileList = Array.from(target.files);
        for (const file of fileList) {
          if (file) {
            if (this.validateFile(file)) {
              const fileAsData = await this.fileService.readFile(file);
              // Guardamos la imagen en this.preview (renderizado)
              this.preview.push(fileAsData);
              // Creamos un objeto Files y lo añadimos a this.files
              this.files.push(
                this.fileService.createFileObject(
                  file,
                  this.uploaderForm.controls['documentType'].value,
                  entityId,
                  this.getPolicy()
                )
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

  uploadFile(i: number, action?: ModalActions) {
    const formData = this.fileMapper.toFormData(this.files[i]);
    this.filesUseCase.upload(formData).subscribe({
      next: (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress[i] = Math.round((event.loaded / event.total!) * 100);
        } else if (event.type === HttpEventType.Response) {
          const response = event.body;
          if (response.affectedRows > 0) {
            if (action !== this.modalActions.SLEEP) {
              this.closeParentModal(this.modalActions.CANCEL);
            }
            this.notifier.showNotification(
              'success',
              `Archivo ${this.files[i].name} subido con éxito`
            );
          }
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
        } else {
          this.errorHandler.handleUnkonwError(error);
        }
      },
    });
  }

  closeParentModal(action: ModalActions) {
    this.closeModal.emit(action);
  }

  updateType(type: string, index: number): void {
    this.files[index].type = type;
  }

  getPolicy(): FilePolicy {
    const route = this.appState.state.activeRoute;
    if (route === PageRoutes.PRODUCTS_LIST) return FilePolicy.PUBLIC;
    else return FilePolicy.PRIVATE;
  }

  deleteFiles(i?: number): void {
    if (i) {
      this.preview.splice(i, 1);
      this.files.splice(i, 1);
    } else {
      this.preview = [];
      this.files = [];
    }
    this.inputFileRef.nativeElement.value = '';
  }

  get documentTypeControl(): AbstractControl {
    return this.uploaderForm.controls['documentType'];
  }
}
