import { Component } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  AbstractControl,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Validators } from 'ngx-editor';
import { Subject, takeUntil } from 'rxjs';
import { UpdateProviders } from 'src/app/providers/application/update-providers.use-case';
import { IProvider, Provider } from 'src/app/providers/domain/providers';
import { DomainValidationError } from 'src/app/shared/domain/domain-validation.exception';
import { Email } from 'src/app/shared/domain/value-objects/email.value-object';
import { ErrorHandlerService } from 'src/app/shared/error/error-handler';
import { FieldValidationError } from 'src/app/shared/error/field-validation-error';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import { ActiveEntityService } from 'src/app/ui/services/active-entity-service.service';
import { FormMode } from 'src/app/ui/services/app-state.service';
import { ModalActions } from 'src/app/ui/shared/enums/modalActions.enum';
import { CustomErrorStateMatcher } from 'src/app/ui/shared/helpers/custom-error-state-macher';
import { FormsHelperService } from 'src/app/ui/shared/helpers/forms-helper.service';

@Component({
  selector: 'app-create-provider',
  templateUrl: './create-provider.component.html',
  styleUrls: ['./create-provider.component.scss'],
})
export class CreateProviderComponent {
  newProviderCreated!: IProvider;
  createProviderForm: UntypedFormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    email: ['', []],
    phone: [null, []],
    address: ['', []],
  });

  matcher = new CustomErrorStateMatcher();
  private destroy$ = new Subject();
  modalRef!: NgbActiveModal;
  modalActions = ModalActions;

  constructor(
    public modal: NgbActiveModal,
    private formBuilder: UntypedFormBuilder,
    private notifier: NotificationAdapter,
    private errorHandler: ErrorHandlerService,
    private formsHelperService: FormsHelperService,
    private activeEntityService: ActiveEntityService,
    private providerService: UpdateProviders
  ) {}

  ngOnInit(): void {
    this.modalRef = this.modal;
    this.formsHelperService.initFormCreateMode();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  close(action: ModalActions): void {
    if (action === this.modalActions.CANCEL) {
      this.newProviderCreated
        ? this.modalRef.close(this.newProviderCreated)
        : this.modalRef.close(false);
      return;
    }
    if (!this.createProviderForm.valid) {
      const invalidFields = this.formsHelperService.getInvalidFields(
        this.createProviderForm
      );
      this.notifier.showNotification('warning', invalidFields);
      throw new FieldValidationError(invalidFields);
    } else this.createProviderObject(action);
  }

  createProviderObject(action: ModalActions) {
    let provider!: IProvider;
    try {
      provider = Provider.create(this.getFormData(this.createProviderForm));
    } catch (error: any) {
      if (error instanceof DomainValidationError) {
        this.errorHandler.handleDomainError(error);
      } else this.errorHandler.handleUnkonwError(error);
    }

    this.createProvider(provider, action);
  }

  createProvider(provider: IProvider, action: ModalActions): void {
    let email!: Email;
    try {
      email = Email.create(this.createProviderForm.value.email);
    } catch (error: any) {
      if (error instanceof DomainValidationError) {
        this.errorHandler.handleDomainError(error);
      } else this.errorHandler.handleUnkonwError(error);
    }
    this.providerService
      .create(provider)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.notifier.showNotification('success', 'Proveedor creado');
            if (action === this.modalActions.NEXT) {
              this.newProviderCreated = res;
              this.activeEntityService.setActiveEntity(
                this.newProviderCreated,
                this.newProviderCreated.provider_id!
              );
            } else if (action === this.modalActions.SAVE) {
              this.modalRef.close(res);
            }
          }
        },
      });
  }

  getFormData(form: UntypedFormGroup): IProvider {
    const mode: FormMode = FormMode.CREATE;
    return this.formsHelperService.createProviderFormData(form);
  }

  get nameControl(): AbstractControl {
    return this.createProviderForm.controls['name'];
  }
  get emailControl(): AbstractControl {
    return this.createProviderForm.controls['email'];
  }
  get phonePriceControl(): AbstractControl {
    return this.createProviderForm.controls['phone'];
  }
  get addressControl(): AbstractControl {
    return this.createProviderForm.controls['address'];
  }
}
