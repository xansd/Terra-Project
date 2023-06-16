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
import {
  FilePolicy,
  FilesTypes,
  IFiles,
  IFilesType,
} from 'src/app/files/domain/files';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ErrorHandlerService } from 'src/app/shared/error/error-handler';
import { FilesDTOMapper } from 'src/app/files/infrastructure/files.mapper';
import {
  InvalidFileExtensionError,
  InvalidFileSizeError,
} from 'src/app/files/domain/files.exceptions';
import { AppStateService, FormMode } from '../../services/app-state.service';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { ModalActions } from '../../shared/enums/modalActions.enum';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Subject, take, takeUntil } from 'rxjs';
import { PageRoutes } from '../../pages/pages-info.config';
import { ActiveEntityService } from '../../services/active-entity-service.service';
import { ImgCropperComponent } from '../img-cropper/img-cropper.component';
import UPLOADER_CONFIG from './file-uploader.config';

const modalOptions: NgbModalOptions = {
  backdrop: 'static',
  keyboard: false,
};

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent implements OnInit, OnDestroy {
  @ViewChild('selectedDocumentType', { static: false })
  selectedDocumentType!: ElementRef<HTMLSelectElement>;
  filesTypes = FilesTypes;
  documetTypeActive: any;
  isLoading: boolean = true;
  @Input('isUploaderEnabled') isUploaderEnabled!: boolean;
  @Input('modalRef') modalRef!: NgbActiveModal;
  @Output() closeModal: EventEmitter<ModalActions> =
    new EventEmitter<ModalActions>();
  @Output() switch: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('inputFile') inputFileRef!: ElementRef<HTMLInputElement>;
  REQUIRED_FILE_TYPES = config.REQUIRED_FILE_TYPES;
  defaultImage = config.DEFAULT_IMAGE;
  preview: any = [];
  files: any = [];
  progress: number[] = [];
  fileMapper = new FilesDTOMapper();
  modalActions = ModalActions;
  documentTypes: IFilesType[] = [];
  formMode!: string;
  formModes = FormMode;

  uploaderForm: UntypedFormGroup = this.formBuilder.group({
    documentType: [1, [Validators.required]],
    files: [],
  });
  private destroy$ = new Subject();

  constructor(
    private fileService: FileService,
    private modalService: NgbModal,
    private filesUseCase: FilesUseCases,
    private notifier: NotificationAdapter,
    private appState: AppStateService,
    private activeEntityService: ActiveEntityService,
    private errorHandler: ErrorHandlerService,
    private formBuilder: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.formMode = this.getFormMode();
    this.formMode === FormMode.UPDATE
      ? (this.isUploaderEnabled = true)
      : (this.isUploaderEnabled = false);
    this.getDocumentsType();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  /***********************GESTION TYPE DOC***********************************/
  getDocumentsType(): void {
    this.filesUseCase
      .getTypes()
      .pipe(take(1))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (types: IFilesType[]) => {
          this.filterDocumentTypes(types);
        },
      });
  }

  filterDocumentTypes(types: IFilesType[]) {
    const currentURL = this.appState.state.activeRoute as PageRoutes;

    if (UPLOADER_CONFIG.PARTNERS_VIEWS.includes(currentURL)) {
      this.documentTypes = types.filter((type) =>
        UPLOADER_CONFIG.PARTNERS_DOCUMENTS.includes(type.file_type_id)
      );
      this.setActiveDocumentType(FilesTypes.ALTA);
    } else if (UPLOADER_CONFIG.PRODUCTS_VIEWS.includes(currentURL)) {
      this.documentTypes = types.filter((type) =>
        UPLOADER_CONFIG.PRODUCTS_DOCUMENTS.includes(type.file_type_id)
      );
      this.setActiveDocumentType(FilesTypes.COVER);
    } else {
      this.documentTypes = types;
      this.setActiveDocumentType(FilesTypes.DNI);
    }
  }

  setActiveDocumentType(i: number) {
    const documentActive: any = this.documentTypes.find(
      (type) => type.file_type_id === i
    );
    this.documetTypeActive = documentActive.file_type_id;
    this.uploaderForm.patchValue({
      documentType: this.documetTypeActive.toString(),
    });
  }

  onChangeSelectedDocumentType() {
    this.documetTypeActive = Number(
      this.selectedDocumentType.nativeElement.value
    );
  }

  getDocumentType(file: IFiles): string {
    for (const i of this.documentTypes) {
      if (i.file_type_id == file.type) return i.name;
    }
    return '';
  }

  /***********************GESTION TYPE DOC***********************************/

  /***********************GESTION FICHEROS***********************************/

  onFileSelect(event: Event) {
    if (this.documetTypeActive !== this.filesTypes.COVER)
      this.onFileMultipleSelect(event);
    else this.onFileCoverSelect(event);
  }

  onFileCoverSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      const file: File = target.files[0];
      if (this.validateFile(file, true)) {
        // Pasamos la imagen al cropper
        const modalRef = this.modalService.open(
          ImgCropperComponent,
          modalOptions
        );
        modalRef.componentInstance.event = event;
        modalRef.componentInstance.type = file.type;
        modalRef.result
          .then((result) => {
            if (result) {
              const fileCropped = this.fileService.dataURItoFile(
                result,
                file.name,
                file.type
              );
              this.storeFile(fileCropped);
            }
          })
          .catch((error) => {
            if (error) console.error(error);
          });
      }
    }
  }

  onFileMultipleSelect(event: Event): void {
    try {
      const target = event.target as HTMLInputElement;
      if (target.files) {
        const fileList = Array.from(target.files);
        for (const file of fileList) {
          if (file) {
            if (this.validateFile(file)) {
              this.storeFile(file);
            }
          }
        }
      }
    } catch (error) {
      this.errorHandler.handleUnkonwError(error as unknown as Error);
    }
  }

  async storeFile(file: File) {
    const entityId = this.activeEntityService.getActiveEntityId();
    const fileAsData = await this.fileService.readFile(file);
    // Guardamos la imagen en this.preview (renderizado)
    this.preview.push(fileAsData);
    // Creamos un objeto Files y lo añadimos a this.files
    this.files.push(
      this.fileService.createFileObject(
        file,
        //this.uploaderForm.controls['documentType'].value,
        this.documetTypeActive,
        entityId!,
        this.getPolicy()
      )
    );
  }

  validateFile(file: File, isCover?: boolean): boolean {
    if (isCover) {
      if (!this.fileService.validateFileImageExtension(file)) {
        this.errorHandler.handleDomainError({
          message: `Fichero "${file.name}" con formato incorrecto (jpg, png, webp, jpeg). Selección anulada`,
        } as Error);
        return false;
      }
    } else {
      if (!this.fileService.validateFileExtension(file)) {
        this.errorHandler.handleDomainError({
          message: `Fichero "${file.name}" con formato incorrecto. Selección anulada`,
        } as Error);
        return false;
      }
    }
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

  /***********************GESTION FICHEROS***********************************/

  /***********************************AUX************************************/
  getFormMode(): string {
    return this.appState.state.formMode;
  }

  isImage(file: IFiles) {
    return this.fileService.isImage(file.file);
  }

  switchEvent() {
    this.switch.emit(true);
  }

  getPolicy(): FilePolicy {
    const route = this.appState.state.activeRoute;
    if (route === PageRoutes.PRODUCTS_LIST) return FilePolicy.PUBLIC;
    else return FilePolicy.PRIVATE;
  }

  closeParentModal(action: ModalActions) {
    this.closeModal.emit(action);
  }

  /***********************************AUX************************************/
}
