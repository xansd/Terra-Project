import { Component, Input } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, take, takeUntil } from 'rxjs';
import { GetProductsUseCase } from 'src/app/products/application/get.use-cases';
import { UpdateProductUseCase } from 'src/app/products/application/update.use-cases';
import {
  ICategories,
  IProduct,
  ISubcategories,
  ProductsType,
} from 'src/app/products/domain/products';
import { IProductSubsetDTO } from 'src/app/products/infrastructure/products-dto.mapper';
import { DomainValidationError } from 'src/app/shared/domain/domain-validation.exception';
import { ErrorHandlerService } from 'src/app/shared/error/error-handler';
import { FieldValidationError } from 'src/app/shared/error/field-validation-error';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import { FormMode } from 'src/app/ui/services/app-state.service';
import { ProductsService } from 'src/app/ui/services/products.service';
import { ModalActions } from 'src/app/ui/shared/enums/modalActions.enum';
import { CustomErrorStateMatcher } from 'src/app/ui/shared/helpers/custom-error-state-macher';
import { FormsHelperService } from 'src/app/ui/shared/helpers/forms-helper.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent {
  switchEventActive = true;
  editProductForm: UntypedFormGroup = this.formBuilder.group({
    name: [null, [Validators.required]],
    category_id: [1, [Validators.required]],
    subcategories: [[], [Validators.required]],
    active: [null],
    description: [null],
    ancestors: [[]],
    sativa: [0],
    indica: [0],
    thc: [0],
    cbd: [0],
    bank: [null],
    flawour: [null],
    effect: [null],
    cost_price: [0],
    sale_price: [0],
  });
  productEdited!: IProduct;
  modalActions = ModalActions;
  isLoading: boolean = true;
  @Input('uid') uid!: string;
  matcher = new CustomErrorStateMatcher();
  private destroy$ = new Subject();
  product!: IProduct;
  selectedCategory: ICategories = {
    name: '',
    category_id: '',
    type: ProductsType.TERCEROS,
  };
  categories: ICategories[] = [];
  filteredCategories: ICategories[] = [];
  subcategories: ISubcategories[] = [];
  filteredSubcategories: ISubcategories[] = [];
  ancestors: IProductSubsetDTO[] = [];
  productsType = ProductsType;

  constructor(
    public modal: NgbActiveModal,
    private formBuilder: UntypedFormBuilder,
    private notifier: NotificationAdapter,
    private errorHandler: ErrorHandlerService,
    private formsHelperService: FormsHelperService,
    private updateProductService: UpdateProductUseCase,
    private getProductService: GetProductsUseCase,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this, this.formsHelperService.initFormUpdateMode();
    this.getAllFilteredProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.formsHelperService.clearFormMeta();
  }

  getAllFilteredProducts(): void {
    this.getProductService
      .getAllProductsFiltered(ProductsType.TERCEROS)
      .pipe(take(1))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (filteredProducts: IProductSubsetDTO[]) => {
          this.ancestors = filteredProducts;
          this.getCategories();
        },
      });
  }

  getCategories(): void {
    this.getProductService
      .getAllCategories()
      .pipe(take(1))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories: ICategories[]) => {
          this.categories = categories;
          this.getSubCategories();
          this.getProduct(this.uid);
          this.filterCategories(categories);
        },
      });
  }

  filterCategories(categories: ICategories[]): void {
    this.filteredCategories =
      this.productsService.filterCategoriesAllowed(categories);
  }

  getSubCategories(): void {
    this.getProductService
      .getAllSubcategories()
      .pipe(take(1))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (subcategories: ISubcategories[]) => {
          // Pasamos subcategory_id a string para que funcione populate subcategories
          this.subcategories = subcategories.map((sub) => {
            return {
              ...sub,
              subcategory_id: sub.subcategory_id.toString(),
            };
          });
          // this.filterSubCategories(subcategories[0].category_id);
        },
      });
  }

  populateForm(product: IProduct): void {
    const subcategories = (product.subcategories || []).map((sub) =>
      sub.toString()
    );
    const ancestors = product.ancestors || [];

    let formValue: any = {
      name: product.name,
      category_id: product.category_id,
      subcategories: subcategories,
      active: product.active,
      description: product.description,
    };

    if (product.type === ProductsType.MANCOMUNADOS) {
      formValue = {
        ...formValue,
        sativa: product.sativa,
        indica: product.indica,
        thc: product.thc,
        cbd: product.cbd,
        bank: product.bank,
        flawour: product.flawour,
        effect: product.effect,
        ancestors: ancestors,
      };
    } else if (product.type === ProductsType.TERCEROS) {
      formValue = {
        ...formValue,
        cost_price: product.cost_price || 0.0,
        sale_price: product.sale_price || 0.0,
      };
    }

    this.editProductForm.patchValue(formValue);
    this.filterSubCategories(product.category_id);
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

  close(action: ModalActions): void {
    if (action === this.modalActions.CANCEL) {
      this.productEdited
        ? this.modal.close(this.productEdited)
        : this.modal.close(false);
      return;
    }
    if (!this.editProductForm.valid) {
      const invalidFields = this.formsHelperService.getInvalidFields(
        this.editProductForm
      );
      this.notifier.showNotification('warning', invalidFields);
      throw new FieldValidationError(invalidFields);
    } else this.updateProduct(action);
  }

  getProduct(id: string): void {
    this.getProductService.getProduct(id).subscribe({
      next: (product: IProduct) => {
        this.product = product;
        this.populateForm(product);
      },
    });
  }

  updateProduct(action: ModalActions) {
    let product!: IProduct;
    try {
      const user = this.updateProductService.getUpdater();
      const productId = this.product.product_id;
      product = this.createProductEntity(
        this.editProductForm,
        user,
        productId!
      );
    } catch (error: any) {
      if (error instanceof DomainValidationError) {
        this.errorHandler.handleDomainError(error);
      } else this.errorHandler.handleUnkonwError(error);
    }
    this.updateProductService
      .updateProduct(product)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.notifier.showNotification('success', 'Producto editado');
          if (res.affectedRows > 0) {
            if (action === this.modalActions.NEXT) {
              this.productEdited = product;
            } else if (action === this.modalActions.SAVE) {
              this.modal.close(product);
            }
          }
        },
      });
  }

  createProductEntity(
    form: UntypedFormGroup,
    user: string,
    productId: string
  ): IProduct {
    const mode: FormMode = FormMode.UPDATE;
    return this.formsHelperService.createProductFormData(
      form,
      mode,
      user,
      this.selectedCategory,
      productId
    );
  }

  get nameControl(): AbstractControl {
    return this.editProductForm.controls['name'];
  }
  get categoryControl(): AbstractControl {
    return this.editProductForm.controls['category_id'];
  }
  get subcategoryControl(): AbstractControl {
    return this.editProductForm.controls['subcategories'];
  }
  get descriptionControl(): AbstractControl {
    return this.editProductForm.controls['description'];
  }
  get ancestorsControl(): AbstractControl {
    return this.editProductForm.controls['ancestors'];
  }
  get sativaControl(): AbstractControl {
    return this.editProductForm.controls['sativa'];
  }
  get indicaControl(): AbstractControl {
    return this.editProductForm.controls['indica'];
  }
  get thcControl(): AbstractControl {
    return this.editProductForm.controls['thc'];
  }
  get cbdControl(): AbstractControl {
    return this.editProductForm.controls['cbd'];
  }
  get bankControl(): AbstractControl {
    return this.editProductForm.controls['bank'];
  }
  get flawourControl(): AbstractControl {
    return this.editProductForm.controls['flawour'];
  }
  get effectControl(): AbstractControl {
    return this.editProductForm.controls['effect'];
  }
  get costControl(): AbstractControl {
    return this.editProductForm.controls['cost_price'];
  }
  get saleControl(): AbstractControl {
    return this.editProductForm.controls['sale_price'];
  }

  switchEvent(status: boolean) {
    this.switchEventActive = status;
  }
}
