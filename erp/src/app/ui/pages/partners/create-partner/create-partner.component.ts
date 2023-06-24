import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, forkJoin, take, takeUntil } from 'rxjs';
import { CreatePartnerUseCase } from 'src/app/partners/application/create-partner.use-case';
import {
  DocumentTypes,
  IPartner,
  IPartnersType,
  Partner,
} from 'src/app/partners/domain/partner';
import { DomainValidationError } from 'src/app/shared/domain/domain-validation.exception';
import { ErrorHandlerService } from 'src/app/shared/error/error-handler';
import { FieldValidationError } from 'src/app/shared/error/field-validation-error';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import { FormsHelperService } from 'src/app/ui/shared/helpers/forms-helper.service';
import CONFIG from '../../../../config/client.config';
import { CustomErrorStateMatcher } from 'src/app/ui/shared/helpers/custom-error-state-macher';
import { GetPartnerUseCase } from 'src/app/partners/application/get-partners.use-case';
import { PartnerDTOMapper } from 'src/app/partners/infrastructure/partner-dto.mapper';
import {
  AppStateService,
  FormMode,
} from 'src/app/ui/services/app-state.service';
import { PartnerIDNotFoundError } from 'src/app/partners/domain/partner.exceptions';
import { ModalActions } from 'src/app/ui/shared/enums/modalActions.enum';
import { ActiveEntityService } from 'src/app/ui/services/active-entity-service.service';
import { FeesTypes, IFees, IFeesType } from 'src/app/partners/domain/fees';
import { FeesUseCases } from 'src/app/partners/application/fees.use-case';
import { InvalidFeeType } from 'src/app/partners/domain/fees.exceptions';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-create-partner',
  templateUrl: './create-partner.component.html',
  styleUrls: ['./create-partner.component.scss'],
})
export class CreatePartnerComponent implements OnDestroy, OnInit {
  modalActions = ModalActions;
  config = CONFIG;
  active = true;
  types: IPartnersType[] = [];
  feesType: IFeesType[] = [];
  inscriptionsType: IFeesType[] = [];
  lastNumber: number = 20;
  partnerMapper = new PartnerDTOMapper();
  isUploaderEnabled = false;
  modalRef!: NgbActiveModal;
  newPartnerCreated!: IPartner;

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
    fee: [1, [Validators.required]],
    inscription: [3, [Validators.required]],
    debt_limit: [0, [Validators.required]],
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
    private getPartnersService: GetPartnerUseCase,
    private feesService: FeesUseCases,
    private activeEntityService: ActiveEntityService
  ) {}

  ngOnInit(): void {
    this.modalRef = this.modal;
    this.formsHelperService.initFormCreateMode();
    this.getPartnersLastNumber();
    this.getPartnersType();
    this.getFeesType();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.formsHelperService.clearFormMeta();
  }

  close(action: ModalActions): void {
    if (action === this.modalActions.CANCEL) {
      this.newPartnerCreated
        ? this.modalRef.close(this.newPartnerCreated)
        : this.modalRef.close(false);
      return;
    }
    if (!this.createPartnerForm.valid) {
      const invalidFields = this.formsHelperService.getInvalidFields(
        this.createPartnerForm
      );
      this.notifier.showNotification('warning', invalidFields);
      throw new FieldValidationError(invalidFields);
    } else this.newPartner(action);
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

  getFeesType(): void {
    this.feesService
      .getTypes()
      .pipe(take(1))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (types: IFeesType[]) => {
          const feesType: IFeesType[] = [];
          const inscriptionsType: IFeesType[] = [];

          types.forEach((type: IFeesType) => {
            if (type.name === 'CUOTA_20' || type.name === 'CUOTA_EXENTA') {
              feesType.push(type);
            } else {
              inscriptionsType.push(type);
            }
          });

          this.feesType = feesType;
          this.inscriptionsType = inscriptionsType;
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

  newPartner(action: ModalActions): void {
    let partner!: IPartner;
    try {
      const user = this.createPartnerService.getCreator();
      partner = Partner.create(this.getFormData(this.createPartnerForm, user));
    } catch (error: any) {
      if (error instanceof DomainValidationError) {
        this.errorHandler.handleDomainError(error);
      } else if (error instanceof PartnerIDNotFoundError) {
        this.errorHandler.handleDomainError(error);
      } else this.errorHandler.handleUnkonwError(error);
    }

    this.createPartner(partner, action);
  }

  newPartnerFees(partner: IPartner) {
    let fee!: IFees;
    let inscription!: IFees;
    try {
      fee = this.feesService.createFee(partner, FeesTypes.FEES);
      inscription = this.feesService.createFee(partner, FeesTypes.INSCRIPTION);
    } catch (error: any) {
      if (error instanceof InvalidFeeType) {
        this.errorHandler.handleDomainError(error);
      } else this.errorHandler.handleUnkonwError(error);
    }
    this.createFees(fee, inscription, partner);
  }

  createPartner(partner: IPartner, action: ModalActions): void {
    this.createPartnerService
      .createPartner(partner)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.notifier.showNotification('success', 'Socio creado');
            if (action === this.modalActions.NEXT) {
              this.newPartnerCreated = res;
              this.activeEntityService.setActiveEntity(
                this.newPartnerCreated,
                this.newPartnerCreated.partner_id!
              );
              this.isUploaderEnabled = true;
            } else if (action === this.modalActions.SAVE) {
              this.modalRef.close(res);
            }
            this.newPartnerFees(res);
          }
        },
      });
  }

  getNewRegistrationDocument(partner: IPartner) {
    this.getPartnersService
      .getPartnerDocument(partner, DocumentTypes.ALTA)
      .subscribe((res: any) => {
        const blob = res as Blob;
        saveAs(
          blob,
          `${partner.surname}_${partner.name}_${DocumentTypes.ALTA}.docx`
        );
      });
  }

  createFees(fee: IFees, inscription: IFees, partner: IPartner): void {
    const createPartnerFee$ = this.feesService.createPartnerFee(fee);
    const createPartnerInscription$ =
      this.feesService.createPartnerFee(inscription);

    forkJoin([createPartnerFee$, createPartnerInscription$])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([createPartnerFeeRes, createPartnerInscriptionRes]: [
          any,
          any
        ]) => {
          if (createPartnerFeeRes && createPartnerInscriptionRes) {
            this.notifier.showNotification(
              'success',
              'Asiento contable generado'
            );

            this.getNewRegistrationDocument(partner);
          } else {
            this.notifier.showNotification(
              'error',
              'Atención, ha ocurrido un error al generar la cuota del socio.'
            );
          }
        },
        error: (error) => {
          this.errorHandler.handleUnkonwError(error);
        },
      });
  }

  getFormData(form: UntypedFormGroup, user: string): IPartner {
    const mode: FormMode = FormMode.CREATE;
    return this.formsHelperService.createPartnerFormData(form, mode, user);
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
  get debtLimitControl(): AbstractControl {
    return this.createPartnerForm.controls['debt_limit'];
  }
}
