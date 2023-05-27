import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Subject, take, takeUntil } from 'rxjs';
import { FilesUseCases } from 'src/app/files/application/files.use-cases';
import { IFiles, IFilesType } from 'src/app/files/domain/files';
import { AppStateService } from '../../services/app-state.service';
import { FileService } from 'src/app/files/application/files.service';

@Component({
  selector: 'app-file-downloader',
  templateUrl: './file-downloader.component.html',
  styleUrls: ['./file-downloader.component.scss'],
})
export class FileDownloaderComponent implements OnInit, OnDestroy {
  isLoading: boolean = true;
  selectDisabled = true;
  entityId!: string;
  preview: any = [];
  files: any[] = [];
  documentTypes: IFilesType[] = [];
  downloaderForm: UntypedFormGroup = this.formBuilder.group({
    documentType: [1, [Validators.required]],
  });
  private destroy$ = new Subject();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private filesUseCase: FilesUseCases,
    private appState: AppStateService,
    private fileService: FileService
  ) {}

  ngOnInit(): void {
    this.entityId = this.getentityId();
    this.getDocumentsType();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getentityId(): string {
    return this.appState.state.activeEntityID;
  }

  getDocumentsType(): void {
    this.filesUseCase
      .getTypes()
      .pipe(take(1))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (types: IFilesType[]) => {
          this.documentTypes = types;
          this.getEntityfiles();
        },
      });
  }

  getEntityfiles(): void {
    this.isLoading = true;
    this.filesUseCase
      .downloadEntityFiles(this.entityId)
      .pipe(take(1))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: async (files: IFiles[]) => {
          this.files = [];

          for (const file of files) {
            const fileType = this.documentTypes.find(
              (type) => type.file_type_id === file.type
            );
            const type = fileType ? fileType.name : '';

            const convertedFile = this.fileService.bufferToFile(
              file.file!.data, // Buffer del archivo
              file.name // Nombre del archivo
            );

            const fileAsData = await this.fileService.readFile(convertedFile);
            this.preview.push(fileAsData);

            this.files.push({ ...file, type, file: convertedFile });
          }

          this.isLoading = false;
        },
      });
  }

  updateType(type: string, index: number): void {
    this.files[index].type = type;
  }

  openFile(i: number) {
    const urlArchivo = URL.createObjectURL(this.files[i].file);

    // Configura las propiedades de la ventana
    const win = window.open(urlArchivo, '_blank', 'width=800,height=600');

    // Verifica si se pudo abrir la ventana correctamente
    if (win) {
      win.focus(); // Enfoca la ventana abierta
    } else {
      // La ventana emergente fue bloqueada por el navegador
      window.open(urlArchivo, '_blank');
    }
  }

  isImage(file: IFiles) {
    return this.fileService.isImage(file.file);
  }

  saveFile(i: number) {
    const file = this.files[i].file;
    const urlArchivo = URL.createObjectURL(file);

    const link = document.createElement('a');
    link.href = urlArchivo;
    link.download = file.name;

    link.click();

    URL.revokeObjectURL(urlArchivo);
  }

  deleteFiles(i?: number): void {
    if (i) {
      this.preview.splice(i, 1);
      this.files.splice(i, 1);
    } else {
      this.preview = [];
      this.files = [];
    }
  }
}
