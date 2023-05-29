import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  NgbActiveModal,
  NgbDateParserFormatter,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { IPartner, IPartnersType } from 'src/app/partners/domain/partner';
import { FieldValidationError } from 'src/app/shared/error/field-validation-error';
import { CustomErrorStateMatcher } from 'src/app/ui/shared/helpers/custom-error-state-macher';
import CONFIG from '../../../../config/client.config';
import { FormsHelperService } from 'src/app/ui/shared/helpers/forms-helper.service';
import { ErrorHandlerService } from 'src/app/shared/error/error-handler';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import { UpdatePartnerUseCase } from 'src/app/partners/application/update-partner.use.case';
import { GetPartnerUseCase } from 'src/app/partners/application/get-partners.use-case';
import { DomainValidationError } from 'src/app/shared/domain/domain-validation.exception';
import { PartnerDTOMapper } from 'src/app/partners/infrastructure/partner-dto.mapper';
import { DatetimeHelperService } from 'src/app/ui/shared/helpers/datetime.helper.service';
import {
  AppStateService,
  FormMode,
} from 'src/app/ui/services/app-state.service';
import { ModalActions } from 'src/app/ui/shared/enums/modalActions.enum';

@Component({
  selector: 'app-edit-partner',
  templateUrl: './edit-partner.component.html',
  styleUrls: ['./edit-partner.component.scss'],
})
export class EditPartnerComponent implements OnInit, OnDestroy {
  partnerEdited!: IPartner;
  modalActions = ModalActions;
  switchEventActive = true;
  isLoading: boolean = true;
  @Input('uid') uid!: string;
  types: IPartnersType[] = [];
  matcher = new CustomErrorStateMatcher();
  private destroy$ = new Subject();
  partner!: IPartner;
  editPartnerForm: UntypedFormGroup = this.formBuilder.group({
    type: [null, [Validators.required]],
    therapeutic: [null],
    active: [null],
    name: [null, [Validators.required]],
    surname: [null, [Validators.required]],
    dni: [null, [Validators.required, Validators.maxLength(25)]],
    email: [
      null,
      [Validators.required, Validators.pattern(CONFIG.REGEX.EMAIL)],
    ],
    phone: [null, [Validators.required]],
    birth: [null, [Validators.required]],
    address: [null, [Validators.required]],
    cannabis: [0, [Validators.required]],
    hash: [0, [Validators.required]],
    extractions: [0, [Validators.required]],
    others: [0, [Validators.required]],
  });

  partnerMapper = new PartnerDTOMapper();

  constructor(
    public modal: NgbActiveModal,
    private formBuilder: UntypedFormBuilder,
    private notifier: NotificationAdapter,
    private errorHandler: ErrorHandlerService,
    private formsHelperService: FormsHelperService,
    private updatePartnerService: UpdatePartnerUseCase,
    private getPartnersService: GetPartnerUseCase,
    private dateFormatter: DatetimeHelperService
  ) {}

  ngOnInit(): void {
    this, this.formsHelperService.initFormUpdateMode();
    this.getPartner(this.uid);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.formsHelperService.clearFormMeta();
  }

  populateForm(partner: IPartner): void {
    const birthDate = this.dateFormatter.toDatePickerFormat(partner.birthday);
    const typeIndex = this.types.findIndex(
      (item) => item.partner_type_id === partner.partner_type_id
    );
    this.editPartnerForm.patchValue({
      type: this.types[typeIndex],
      therapeutic: partner.therapeutic,
      active: partner.active,
      name: partner.name,
      surname: partner.surname,
      dni: partner.dni,
      email: partner.email.value,
      phone: partner.phone,
      birth: birthDate,
      address: partner.address,
      cannabis: 0,
      hash: 0,
      extractions: 0,
      others: 0,
    });
  }

  close(action: ModalActions): void {
    if (action === this.modalActions.CANCEL) {
      this.partnerEdited
        ? this.modal.close(this.partnerEdited)
        : this.modal.close(false);
      return;
    }
    if (!this.editPartnerForm.valid) {
      const invalidFields = this.formsHelperService.getInvalidFields(
        this.editPartnerForm
      );
      this.notifier.showNotification('warning', invalidFields);
      throw new FieldValidationError(invalidFields);
    } else this.updatePartner(action);
  }

  getPartner(id: string): void {
    this.getPartnersService.getPartner(id).subscribe({
      next: (partner: IPartner) => {
        this.partner = partner;
        this.getPartnersType(partner);
      },
    });
  }

  getPartnersType(partner: IPartner): void {
    this.getPartnersService
      .getPartnersType()
      .pipe(take(1))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (types: IPartnersType[]) => {
          this.types = types;
          this.populateForm(partner);
          this.isLoading = false;
        },
      });
  }

  updatePartner(action: ModalActions): void {
    let partner!: IPartner;
    try {
      const user = this.updatePartnerService.getUpdater();
      const partnerId = this.partner.partner_id;
      partner = this.createPartnerEntity(
        this.editPartnerForm,
        user,
        partnerId!
      );
    } catch (error: any) {
      if (error instanceof DomainValidationError) {
        this.errorHandler.handleDomainError(error);
      } else this.errorHandler.handleUnkonwError(error);
    }

    this.apiUpdatePartner(partner)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.notifier.showNotification('success', 'Socio editado');
          partner.created_at = this.partner.created_at;
          partner.number = this.partner.number;
          if (res.affectedRows > 0) {
            if (action === this.modalActions.NEXT) {
              this.partnerEdited = partner;
            } else if (action === this.modalActions.SAVE) {
              this.modal.close(partner);
            }
          }
        },
      });
  }
  apiUpdatePartner(partner: IPartner): Observable<void> {
    return this.updatePartnerService.updatePartner(partner);
  }

  createPartnerEntity(
    form: UntypedFormGroup,
    user: string,
    partnerId: string
  ): IPartner {
    const mode: FormMode = FormMode.UPDATE;
    return this.partnerMapper.createPartnerFormData(
      form,
      mode,
      user,
      partnerId
    );
  }

  formatDate(date: string) {
    const t = this.dateFormatter.getFormattedDate(date);
    return this.dateFormatter.getFormattedDate(date);
  }

  switchEvent(status: boolean) {
    this.switchEventActive = status;
  }

  get nameControl(): AbstractControl {
    return this.editPartnerForm.controls['name'];
  }
  get surnameControl(): AbstractControl {
    return this.editPartnerForm.controls['surname'];
  }
  get dniControl(): AbstractControl {
    return this.editPartnerForm.controls['dni'];
  }
  get emailControl(): AbstractControl {
    return this.editPartnerForm.controls['email'];
  }
  get phoneControl(): AbstractControl {
    return this.editPartnerForm.controls['phone'];
  }
  get birthControl(): AbstractControl {
    return this.editPartnerForm.controls['birth'];
  }
  get addressControl(): AbstractControl {
    return this.editPartnerForm.controls['address'];
  }
  get cannabisControl(): AbstractControl {
    return this.editPartnerForm.controls['cannabis'];
  }
  get hashControl(): AbstractControl {
    return this.editPartnerForm.controls['hash'];
  }
  get extractionsControl(): AbstractControl {
    return this.editPartnerForm.controls['extractions'];
  }
  get othersControl(): AbstractControl {
    return this.editPartnerForm.controls['others'];
  }
}
