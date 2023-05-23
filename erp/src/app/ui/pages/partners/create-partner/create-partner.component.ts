import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { CreatePartnerUseCase } from 'src/app/partners/application/create-partner.use-case';
import { IPartner, IPartnersType } from 'src/app/partners/domain/partner';
import { DomainValidationError } from 'src/app/shared/domain/domain-validation.exception';
import { ErrorHandlerService } from 'src/app/shared/error/error-handler';
import { FieldValidationError } from 'src/app/shared/error/field-validation-error';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import { FormsHelperService } from 'src/app/ui/shared/helpers/forms-helper.service';
import CONFIG from '../../../../config/client.config';
import { CustomErrorStateMatcher } from 'src/app/ui/shared/helpers/custom-error-state-macher';
import { GetPartnerUseCase } from 'src/app/partners/application/get-partners.use-case';
import { PartnerDTOMapper } from 'src/app/partners/infratructure/partner-dto.mapper';

@Component({
  selector: 'app-create-partner',
  templateUrl: './create-partner.component.html',
  styleUrls: ['./create-partner.component.scss'],
})
export class CreatePartnerComponent implements OnDestroy, OnInit {
  config = CONFIG;
  active = true;
  types: IPartnersType[] = [];
  lastNumber: number = 20;
  partnerMapper = new PartnerDTOMapper();

  createPartnerForm: UntypedFormGroup = this.formBuilder.group({
    type: [1, [Validators.required]],
    therapeutic: [false],
    active: [true],
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

  matcher = new CustomErrorStateMatcher();
  private destroy$ = new Subject();

  constructor(
    public modal: NgbActiveModal,
    private formBuilder: UntypedFormBuilder,
    private notifier: NotificationAdapter,
    private errorHandler: ErrorHandlerService,
    private formsHelperService: FormsHelperService,
    private createPartnerService: CreatePartnerUseCase,
    private getPartnersService: GetPartnerUseCase
  ) {}

  ngOnInit(): void {
    this.getPartnersLastNumber();
    this.getPartnersType();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  close(result: boolean | IPartner): void {
    if (!result) {
      this.modal.close(false);
      return;
    }
    if (!this.createPartnerForm.valid) {
      const invalidFields = this.formsHelperService.getInvalidFields(
        this.createPartnerForm
      );
      this.notifier.showNotification('warning', invalidFields);
      throw new FieldValidationError(invalidFields);
    } else this.createPartner();
  }

  getPartnersType(): void {
    this.getPartnersService
      .getPartnersType()
      .pipe(take(1))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (types: IPartnersType[]) => {
          this.types = types;
        },
      });
  }

  getPartnersLastNumber(): void {
    this.getPartnersService
      .getPartnerLastNumber()
      .pipe(takeUntil(this.destroy$))
      .pipe(take(1))
      .subscribe({
        next: (n: any) => {
          if (!n.length) return;
          this.lastNumber = n[0].number;
          this.lastNumber++;
        },
      });
  }

  createPartner(): void {
    let partner!: IPartner;
    try {
      const user = this.createPartnerService.getCreator();
      partner = this.createPartnerEntity(this.createPartnerForm, user);
    } catch (error: any) {
      if (error instanceof DomainValidationError) {
        this.errorHandler.handleDomainError(error);
      } else this.errorHandler.handleUnkonwError(error);
    }

    this.apiCreatePartner(partner)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.notifier.showNotification('success', 'Socio creado');
            this.modal.close(res);
          }
        },
      });
  }
  apiCreatePartner(partner: IPartner): Observable<void> {
    return this.createPartnerService.createPartner(partner);
  }

  createPartnerEntity(form: UntypedFormGroup, user: string): IPartner {
    const mode = 'create';
    return this.partnerMapper.createPartnerFormData(form, mode, user);
  }

  get nameControl(): AbstractControl {
    return this.createPartnerForm.controls['name'];
  }
  get surnameControl(): AbstractControl {
    return this.createPartnerForm.controls['surname'];
  }
  get dniControl(): AbstractControl {
    return this.createPartnerForm.controls['dni'];
  }
  get emailControl(): AbstractControl {
    return this.createPartnerForm.controls['email'];
  }
  get phoneControl(): AbstractControl {
    return this.createPartnerForm.controls['phone'];
  }
  get birthControl(): AbstractControl {
    return this.createPartnerForm.controls['birth'];
  }
  get addressControl(): AbstractControl {
    return this.createPartnerForm.controls['address'];
  }
  get cannabisControl(): AbstractControl {
    return this.createPartnerForm.controls['cannabis'];
  }
  get hashControl(): AbstractControl {
    return this.createPartnerForm.controls['hash'];
  }
  get extractionsControl(): AbstractControl {
    return this.createPartnerForm.controls['extractions'];
  }
  get othersControl(): AbstractControl {
    return this.createPartnerForm.controls['others'];
  }
}
