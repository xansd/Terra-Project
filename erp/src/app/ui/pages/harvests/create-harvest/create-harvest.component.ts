import { Component, Input } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Harvests, IHarvests } from 'src/app/purchases/domain/harvests';
import { ErrorHandlerService } from 'src/app/shared/error/error-handler';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import { ActiveEntityService } from 'src/app/ui/services/active-entity-service.service';
import { ModalActions } from 'src/app/ui/shared/enums/modalActions.enum';
import { FormsHelperService } from 'src/app/ui/shared/helpers/forms-helper.service';
import { IProvider } from '../../../../providers/domain/providers';
import { IProductSubsetDTO } from 'src/app/products/infrastructure/products-dto.mapper';
import { Subject, take, takeUntil } from 'rxjs';
import { CustomErrorStateMatcher } from 'src/app/ui/shared/helpers/custom-error-state-macher';
import { GetProductsUseCase } from 'src/app/products/application/get.use-cases';
import { GetProviders } from 'src/app/providers/application/get-providers.use-cases';
import { ProductsType } from 'src/app/products/domain/products';
import { FieldValidationError } from 'src/app/shared/error/field-validation-error';
import { FormMode } from 'src/app/ui/services/app-state.service';
import { DomainValidationError } from 'src/app/shared/domain/domain-validation.exception';
import { UpdateHarvests } from 'src/app/purchases/application/update-harvests.use-case';

@Component({
  selector: 'app-create-harvest',
  templateUrl: './create-harvest.component.html',
  styleUrls: ['./create-harvest.component.scss'],
})
export class CreateHarvestComponent {
  @Input('cultivatorId') cultivatorId!: string;
  @Input('varietyId') varietyId!: string;
  providers: IProvider[] = [];
  products: IProductSubsetDTO[] = [];
  newHarvestCreated!: IHarvests;
  createHarvestForm: UntypedFormGroup = this.formBuilder.group({
    provider_id: ['', [Validators.required]],
    product_id: ['', [Validators.required]],
    cost_price: [0, [Validators.required]],
    fee_amount: [0, [Validators.required]],
    quantity: [0, [Validators.required, Validators.min(0)]],
    notes: [''],
    // stock: [0, [Validators.required]],
    // manicured: [0, [Validators.required]],
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
    private productService: GetProductsUseCase,
    private providerService: GetProviders,
    private harvestService: UpdateHarvests
  ) {}

  ngOnInit(): void {
    this.modalRef = this.modal;
    this.formsHelperService.initFormCreateMode();
    this.getProviders(ProductsType.MANCOMUNADOS);
    this.getAllFilteredProducts(ProductsType.MANCOMUNADOS);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onProductChange(event: Event) {}

  onProviderChange(event: Event) {}

  getProviders(type: ProductsType): void {
    this.providerService
      .getAll(type)
      .pipe(take(1))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (providers: IProvider[]) => {
          this.providers = providers;
          this.patchCultivator();
        },
      });
  }

  patchCultivator(): void {
    let patchProvider = this.providers[0].provider_id;
    if (this.cultivatorId) patchProvider = this.cultivatorId;
    this.createHarvestForm.patchValue({
      provider_id: patchProvider,
    });
  }

  patchVariety(): void {
    let patchProduct = this.products[0].product_id;
    if (this.varietyId) patchProduct = this.varietyId;
    this.createHarvestForm.patchValue({
      product_id: patchProduct,
    });
  }

  getAllFilteredProducts(type: ProductsType): void {
    this.productService
      .getAllProductsFiltered(type)
      .pipe(take(1))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products: IProductSubsetDTO[]) => {
          this.products = products;
          this.patchVariety();
        },
      });
  }

  close(action: ModalActions): void {
    if (action === this.modalActions.CANCEL) {
      this.newHarvestCreated
        ? this.modalRef.close(this.newHarvestCreated)
        : this.modalRef.close(false);
      return;
    }
    if (!this.createHarvestForm.valid) {
      const invalidFields = this.formsHelperService.getInvalidFields(
        this.createHarvestForm
      );
      this.notifier.showNotification('warning', invalidFields);
      throw new FieldValidationError(invalidFields);
    } else this.createHarvestObject(action);
  }

  createHarvestObject(action: ModalActions) {
    let harvest!: IHarvests;
    try {
      harvest = Harvests.create(this.getFormData(this.createHarvestForm));
    } catch (error: any) {
      if (error instanceof DomainValidationError) {
        this.errorHandler.handleDomainError(error);
      } else this.errorHandler.handleUnkonwError(error);
    }

    this.createHarvest(harvest, action);
  }

  createHarvest(harvest: IHarvests, action: ModalActions): void {
    this.harvestService
      .createHarvest(harvest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.notifier.showNotification('success', 'Cultivo creado');
            if (action === this.modalActions.NEXT) {
              this.newHarvestCreated = res;
              this.activeEntityService.setActiveEntity(
                this.newHarvestCreated,
                this.newHarvestCreated.harvest_id!
              );
            } else if (action === this.modalActions.SAVE) {
              this.modalRef.close(res);
            }
          }
        },
      });
  }

  getFormData(form: UntypedFormGroup): IHarvests {
    const mode: FormMode = FormMode.CREATE;
    return this.formsHelperService.createHarvestFormData(form);
  }

  get providerControl(): AbstractControl {
    return this.createHarvestForm.controls['provider_id'];
  }
  get productControl(): AbstractControl {
    return this.createHarvestForm.controls['product_id'];
  }
  get costPriceControl(): AbstractControl {
    return this.createHarvestForm.controls['cost_price'];
  }
  get feeAmountControl(): AbstractControl {
    return this.createHarvestForm.controls['fee_amount'];
  }
  get quantityControl(): AbstractControl {
    return this.createHarvestForm.controls['quantity'];
  }
  get notesControl(): AbstractControl {
    return this.createHarvestForm.controls['notes'];
  }
  // get manicuredControl(): AbstractControl {
  //   return this.createHarvestForm.controls['manicured'];
  // }
}
