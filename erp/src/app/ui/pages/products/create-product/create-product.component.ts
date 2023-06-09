import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  UntypedFormGroup,
  Validators,
  UntypedFormBuilder,
  AbstractControl,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, take, takeUntil } from 'rxjs';
import { CreateProductUseCase } from 'src/app/products/application/create.use-cases';
import { GetProductsUseCase } from 'src/app/products/application/get.use-cases';
import {
  ICategories,
  IProduct,
  ISubcategories,
  Product,
  ProductsType,
} from 'src/app/products/domain/products';
import { ErrorHandlerService } from 'src/app/shared/error/error-handler';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import { ActiveEntityService } from 'src/app/ui/services/active-entity-service.service';
import { CustomErrorStateMatcher } from 'src/app/ui/shared/helpers/custom-error-state-macher';
import { FormsHelperService } from 'src/app/ui/shared/helpers/forms-helper.service';
import { ModalActions } from 'src/app/ui/shared/enums/modalActions.enum';
import { FieldValidationError } from 'src/app/shared/error/field-validation-error';
import { FormMode } from 'src/app/ui/services/app-state.service';
import { DomainValidationError } from 'src/app/shared/domain/domain-validation.exception';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
})
export class CreateProductComponent {
  productsType = ProductsType;
  selectedCategory: ICategories = {
    name: '',
    category_id: '',
    type: ProductsType.MANCOMUNADOS,
  };
  categories: ICategories[] = [];
  subcategories: ISubcategories[] = [];
  filteredSubcategories: ISubcategories[] = [];
  ancestors: IProduct[] = [];
  isUploaderEnabled = false;
  modalActions = ModalActions;
  newProductCreated!: IProduct;

  createProductForm: UntypedFormGroup = this.formBuilder.group({
    name: [null, [Validators.required]],
    category_id: [1, [Validators.required]],
    subcategories: [1, [Validators.required]],
    description: [null, [Validators.required]],
    ancestors: [0, [Validators.required]],
    sativa: [0, [Validators.required]],
    indica: [0, [Validators.required]],
    thc: [0, [Validators.required]],
    cbd: [0, [Validators.required]],
    bank: [null, [Validators.required]],
    flawour: [null, [Validators.required]],
    effect: [null, [Validators.required]],
    cost_price: [0, [Validators.required]],
    sale_price: [0, [Validators.required]],
  });

  matcher = new CustomErrorStateMatcher();
  private destroy$ = new Subject();
  modalRef!: NgbActiveModal;

  constructor(
    public modal: NgbActiveModal,
    private formBuilder: UntypedFormBuilder,
    private notifier: NotificationAdapter,
    private errorHandler: ErrorHandlerService,
    private formsHelperService: FormsHelperService,
    private createProductService: CreateProductUseCase,
    private getProductsService: GetProductsUseCase,
    private activeEntityService: ActiveEntityService
  ) {}

  ngOnInit(): void {
    this.modalRef = this.modal;
    this.formsHelperService.initFormCreateMode();
    this.getCategories();
    this.getSubCategories();
  }

  onCategoryChange(event: Event) {
    const categoryId = (event.target as HTMLSelectElement).value as string;
    const category = this.categories.find(
      (category) => category.category_id == categoryId
    );
    this.selectedCategory = category!;
    this.filterSubCategories(categoryId);
  }

  filterSubCategories(categoryId: string) {
    this.filteredSubcategories = this.subcategories.filter(
      (subcategory) => subcategory.category_id == categoryId
    );
  }

  getCategories(): void {
    this.getProductsService
      .getAllCategories()
      .pipe(take(1))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories: ICategories[]) => {
          this.categories = categories;
          this.selectedCategory = categories[0];
          console.log(this.selectedCategory);
        },
      });
  }

  getSubCategories(): void {
    this.getProductsService
      .getAllSubcategories()
      .pipe(take(1))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (subcategories: ISubcategories[]) => {
          this.subcategories = subcategories;
          this.filterSubCategories(subcategories[0].category_id);
        },
      });
  }

  getAllFilteredProducts(): void {
    this.getProductsService
      .getAllCategories()
      .pipe(take(1))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories: ICategories[]) => {
          this.categories = categories;
          this.selectedCategory = categories[0];
          console.log(this.selectedCategory);
        },
      });
  }

  close(action: ModalActions): void {
    if (action === this.modalActions.CANCEL) {
      this.newProductCreated
        ? this.modalRef.close(this.newProductCreated)
        : this.modalRef.close(false);
      return;
    }
    if (!this.createProductForm.valid) {
      const invalidFields = this.formsHelperService.getInvalidFields(
        this.createProductForm
      );
      this.notifier.showNotification('warning', invalidFields);
      throw new FieldValidationError(invalidFields);
    } else this.newProduct(action);
  }

  newProduct(action: ModalActions) {
    let product!: IProduct;
    try {
      const user = this.createProductService.getCreator();
      product = Product.create(this.getFormData(this.createProductForm, user));
    } catch (error: any) {
      if (error instanceof DomainValidationError) {
        this.errorHandler.handleDomainError(error);
      } else this.errorHandler.handleUnkonwError(error);
    }

    this.createProduct(product, action);
  }

  createProduct(product: IProduct, action: ModalActions): void {
    this.createProductService
      .createProduct(product)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.notifier.showNotification('success', 'Producto creado');
            if (action === this.modalActions.NEXT) {
              this.newProductCreated = res;
              this.activeEntityService.setActiveEntity(
                this.newProductCreated,
                this.newProductCreated.product_id!
              );
              this.isUploaderEnabled = true;
            } else if (action === this.modalActions.SAVE) {
              this.modalRef.close(res);
            }
          }
        },
      });
  }

  getFormData(form: UntypedFormGroup, user: string): IProduct {
    const mode: FormMode = FormMode.CREATE;
    return this.formsHelperService.createProductFormData(
      form,
      mode,
      user,
      this.selectedCategory
    );
  }

  get nameControl(): AbstractControl {
    return this.createProductForm.controls['name'];
  }
  get categoryControl(): AbstractControl {
    return this.createProductForm.controls['category_id'];
  }
  get subcategoryControl(): AbstractControl {
    return this.createProductForm.controls['subcategories'];
  }
  get descriptionControl(): AbstractControl {
    return this.createProductForm.controls['description'];
  }
  get ancestorsControl(): AbstractControl {
    return this.createProductForm.controls['ancestors'];
  }
  get sativaControl(): AbstractControl {
    return this.createProductForm.controls['sativa'];
  }
  get indicaControl(): AbstractControl {
    return this.createProductForm.controls['indica'];
  }
  get thcControl(): AbstractControl {
    return this.createProductForm.controls['thc'];
  }
  get cbdControl(): AbstractControl {
    return this.createProductForm.controls['cbd'];
  }
  get bankControl(): AbstractControl {
    return this.createProductForm.controls['bank'];
  }
  get flawourControl(): AbstractControl {
    return this.createProductForm.controls['flawour'];
  }
  get effectControl(): AbstractControl {
    return this.createProductForm.controls['effect'];
  }
  get costControl(): AbstractControl {
    return this.createProductForm.controls['cost_price'];
  }
  get saleControl(): AbstractControl {
    return this.createProductForm.controls['sale_price'];
  }
}
