import { Component, Input } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  AbstractControl,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Validators } from 'ngx-editor';
import { Subject, takeUntil } from 'rxjs';
import { GetProviders } from 'src/app/providers/application/get-providers.use-cases';
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
  selector: 'app-edit-provider',
  templateUrl: './edit-provider.component.html',
  styleUrls: ['./edit-provider.component.scss'],
})
export class EditProviderComponent {
  provider!: IProvider;
  providerEdited!: IProvider;
  isLoading: boolean = true;
  @Input('uid') uid!: string;
  editProviderForm: UntypedFormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    email: ['', []],
    phone: [null, []],
    address: ['', []],
  });

  private destroy$ = new Subject();
  matcher = new CustomErrorStateMatcher();
  modalRef!: NgbActiveModal;
  modalActions = ModalActions;

  constructor(
    public modal: NgbActiveModal,
    private formBuilder: UntypedFormBuilder,
    private notifier: NotificationAdapter,
    private errorHandler: ErrorHandlerService,
    private formsHelperService: FormsHelperService,
    private activeEntityService: ActiveEntityService,
    private updateProviderService: UpdateProviders,
    private getProviderService: GetProviders
  ) {}

  ngOnInit(): void {
    this.modalRef = this.modal;
    this.formsHelperService.initFormCreateMode();
    this.getCultivator(this.uid);
  }

  ngOnDestroy(): void {
    this.formsHelperService.clearFormMeta();
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getCultivator(id: string): void {
    this.getProviderService
      .getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (provider: IProvider) => {
          this.provider = provider;
          this.populateForm(provider);
        },
      });
  }

  populateForm(provider: IProvider): void {
    let formValue: any = {
      name: provider.name,
      email: provider.email?.value,
      phone: provider.phone,
      address: provider.address,
    };
    this.editProviderForm.patchValue(formValue);
  }

  close(action: ModalActions): void {
    if (action === this.modalActions.CANCEL) {
      this.providerEdited
        ? this.modalRef.close(this.providerEdited)
        : this.modalRef.close(false);
      return;
    }
    if (!this.editProviderForm.valid) {
      const invalidFields = this.formsHelperService.getInvalidFields(
        this.editProviderForm
      );
      this.notifier.showNotification('warning', invalidFields);
      throw new FieldValidationError(invalidFields);
    } else this.createProviderObject(action);
  }

  createProviderObject(action: ModalActions) {
    let provider!: IProvider;
    try {
      const providerId = this.provider.provider_id;
      provider = Provider.create(
        this.getFormData(this.editProviderForm, providerId)
      );
    } catch (error: any) {
      if (error instanceof DomainValidationError) {
        this.errorHandler.handleDomainError(error);
      } else this.errorHandler.handleUnkonwError(error);
    }

    this.editProvider(provider, action);
  }

  editProvider(provider: IProvider, action: ModalActions): void {
    let email!: Email;
    try {
      email = Email.create(this.editProviderForm.value.email);
    } catch (error: any) {
      if (error instanceof DomainValidationError) {
        this.errorHandler.handleDomainError(error);
      } else this.errorHandler.handleUnkonwError(error);
    }
    this.updateProviderService
      .updateProvider(provider)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.notifier.showNotification('success', 'Proveedor editado');
            if (action === this.modalActions.NEXT) {
              this.providerEdited = res;
              this.activeEntityService.setActiveEntity(
                this.providerEdited,
                this.providerEdited.provider_id!
              );
            } else if (action === this.modalActions.SAVE) {
              this.modalRef.close(res);
            }
          }
        },
      });
  }

  getFormData(form: UntypedFormGroup, id?: string): IProvider {
    const mode: FormMode = FormMode.UPDATE;
    return this.formsHelperService.createProviderFormData(form, id);
  }

  get nameControl(): AbstractControl {
    return this.editProviderForm.controls['name'];
  }
  get emailControl(): AbstractControl {
    return this.editProviderForm.controls['email'];
  }
  get phonePriceControl(): AbstractControl {
    return this.editProviderForm.controls['phone'];
  }
  get addressControl(): AbstractControl {
    return this.editProviderForm.controls['address'];
  }
}
