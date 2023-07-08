import { Component, Input } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  UntypedFormArray,
  Validators,
  AbstractControl,
  FormArray,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription, take, takeUntil } from 'rxjs';
import { GetProductsUseCase } from 'src/app/products/application/get.use-cases';
import { ProductsType } from 'src/app/products/domain/products';
import { IProductSubsetDTO } from 'src/app/products/infrastructure/products-dto.mapper';
import { GetProviders } from 'src/app/providers/application/get-providers.use-cases';
import { IProvider } from 'src/app/providers/domain/providers';
import { UpdatePurchases } from 'src/app/purchases/application/update-purchases.use-case';
import { IPurchase, Purchase } from 'src/app/purchases/domain/purchases';
import { DomainValidationError } from 'src/app/shared/domain/domain-validation.exception';
import { ErrorHandlerService } from 'src/app/shared/error/error-handler';
import { FieldValidationError } from 'src/app/shared/error/field-validation-error';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import { ActiveEntityService } from 'src/app/ui/services/active-entity-service.service';
import { FormMode } from 'src/app/ui/services/app-state.service';
import { ModalActions } from 'src/app/ui/shared/enums/modalActions.enum';
import { CustomErrorStateMatcher } from 'src/app/ui/shared/helpers/custom-error-state-macher';
import { FormsHelperService } from 'src/app/ui/shared/helpers/forms-helper.service';

@Component({
  selector: 'app-create-purchase',
  templateUrl: './create-purchase.component.html',
  styleUrls: ['./create-purchase.component.scss'],
})
export class CreatePurchaseComponent {
  @Input('providerId') providerId!: string;
  @Input('productId') productId!: string;
  providers: IProvider[] = [];
  products: IProductSubsetDTO[] = [];
  newPurchaseCreated!: IPurchase;
  lot: boolean[] = [false];

  changeFormDetails$!: Subscription;

  createPurchaseForm: UntypedFormGroup = this.formBuilder.group({
    provider_id: ['', [Validators.required]],
    total_amount: [0, [Validators.required]],
    notes: [''],
    purchase_details: this.formBuilder.array([]),
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
    private createPurchaseService: UpdatePurchases,
    private getProviderService: GetProviders,
    private productService: GetProductsUseCase,
    private activeEntityService: ActiveEntityService
  ) {}

  ngOnInit(): void {
    this.modalRef = this.modal;
    this.formsHelperService.initFormCreateMode();
    this.getProviders(ProductsType.TERCEROS);
    this.getAllFilteredProducts(ProductsType.TERCEROS);
    this.addPurchaseDetail();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  initFormSubsToDetailChanges() {
    this.changeFormDetails$ = this.createPurchaseForm.valueChanges.subscribe(
      () => {
        this.calculatePurchaseTotals();
      }
    );
  }

  onProductChange(event: Event) {}

  onProviderChange(event: Event) {}

  getProviders(type: ProductsType): void {
    this.getProviderService
      .getAll(type)
      .pipe(take(1))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (providers: IProvider[]) => {
          this.providers = providers;
          this.patchProvider();
        },
      });
  }

  patchProvider(): void {
    let patchProvider = this.providers[0].provider_id;
    if (this.providerId) patchProvider = this.providerId;
    this.createPurchaseForm.patchValue({
      provider_id: patchProvider,
    });
  }

  patchProduct(): void {
    let patchProduct = this.products[0].product_id;
    if (this.productId) patchProduct = this.productId;
    this.createPurchaseForm.patchValue({
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
          this.patchProduct();
        },
      });
  }

  close(action: ModalActions): void {
    if (action === this.modalActions.CANCEL) {
      this.newPurchaseCreated
        ? this.modalRef.close(this.newPurchaseCreated)
        : this.modalRef.close(false);
      return;
    }
    if (!this.createPurchaseForm.valid) {
      const invalidFields = this.formsHelperService.getInvalidFields(
        this.createPurchaseForm
      );
      this.notifier.showNotification('warning', invalidFields);
      throw new FieldValidationError(invalidFields);
    } else this.createPurchaseObject(action);
  }

  createPurchaseObject(action: ModalActions) {
    let purchase!: IPurchase;
    try {
      purchase = Purchase.create(this.getFormData(this.createPurchaseForm));
    } catch (error: any) {
      if (error instanceof DomainValidationError) {
        this.errorHandler.handleDomainError(error);
      } else this.errorHandler.handleUnkonwError(error);
    }

    this.createPurchase(purchase, action);
  }

  createPurchase(purchase: IPurchase, action: ModalActions): void {
    this.createPurchaseService
      .createPurchase(purchase)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.notifier.showNotification('success', 'Compra creada');
            if (action === this.modalActions.NEXT) {
              this.newPurchaseCreated = res;
              this.activeEntityService.setActiveEntity(
                this.newPurchaseCreated,
                this.newPurchaseCreated.purchase_id!
              );
            } else if (action === this.modalActions.SAVE) {
              this.modalRef.close(res);
            }
          }
        },
      });
  }

  getFormData(form: UntypedFormGroup): IPurchase {
    const mode: FormMode = FormMode.CREATE;
    return this.formsHelperService.createPurchaseFormData(form);
  }

  calculatePurchaseTotals(): void {
    let totalAmount = 0;

    for (let i = 0; i < this.purchaseDetails.length; i++) {
      const detail = this.purchaseDetails.at(i) as UntypedFormGroup;
      const quantity = detail.controls['quantity'].value;
      const amount = detail.controls['amount'].value;
      const lot = detail.controls['lot'].value;

      let lineTotal = 0;

      if (lot > 0) {
        // Cálculo para productos vendidos por lote
        lineTotal = lot * amount;
      } else {
        // Cálculo para productos vendidos por unidad
        lineTotal = quantity * amount;
      }

      totalAmount += lineTotal;
      detail.patchValue({ total: lineTotal }, { emitEvent: false }); // Evitar ciclo infinito
    }

    const currentTotalAmount =
      this.createPurchaseForm.get('total_amount')?.value;
    if (totalAmount !== currentTotalAmount) {
      this.createPurchaseForm.patchValue(
        { total_amount: totalAmount },
        { emitEvent: false }
      );
    }
  }

  addPurchaseDetail() {
    const purchaseDetail = this.formBuilder.group({
      product_id: ['', [Validators.required]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      amount: [0, [Validators.required]],
      lot: [0, [Validators.required, Validators.min(0)]],
    });

    purchaseDetail.valueChanges.subscribe(() => {
      this.calculatePurchaseTotals();
    });

    this.purchaseDetails.push(purchaseDetail);
    this.calculatePurchaseTotals(); // Actualizar los totales al añadir una nueva línea
  }

  removePurchaseDetail(index: number) {
    if (index === 0) return;

    this.purchaseDetails.removeAt(index);

    // Volver a calcular los totales al eliminar una línea de producto
    this.calculatePurchaseTotals();
  }

  get purchaseDetails(): FormArray {
    return this.createPurchaseForm.get('purchase_details') as FormArray;
  }

  get providerControl(): AbstractControl {
    return this.createPurchaseForm.controls['provider_id'];
  }
  get amountControl(): AbstractControl {
    return this.createPurchaseForm.controls['total_amount'];
  }
  get notesControl(): AbstractControl {
    return this.createPurchaseForm.controls['notes'];
  }
}
