import { Component } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subject, take, takeUntil } from 'rxjs';
import { GetProductsUseCase } from 'src/app/products/application/get.use-cases';
import {
  ICategories,
  IProduct,
  ISubcategories,
  ProductsType,
} from 'src/app/products/domain/products';
import { IProductSubsetDTO } from 'src/app/products/infrastructure/products-dto.mapper';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import searchConfig, {
  ProductsSearchTypes,
} from 'src/app/ui/components/searcher/search.config';
import { ActiveEntityService } from 'src/app/ui/services/active-entity-service.service';
import { DatetimeHelperService } from 'src/app/shared/application/datetime.helper.service';
import { CreateVarietiesComponent } from '../create-varieties/create-varieties.component';
import { EditVarietiesComponent } from '../edit-varieties/edit-varieties.component';
import { CreateHarvestComponent } from '../../harvests/create-harvest/create-harvest.component';
import { IHarvests } from 'src/app/purchases/domain/harvests';
import { GetHarvests } from 'src/app/purchases/application/get-harvests.use-cases';
import { Router } from '@angular/router';
import { PageRoutes } from '../../pages-info.config';

const modalEditOptions: NgbModalOptions = {
  backdrop: 'static',
  keyboard: false,
  size: 'xl',
};
const modalOptions: NgbModalOptions = {
  backdrop: 'static',
  keyboard: false,
};

@Component({
  selector: 'app-varieties-details',
  templateUrl: './varieties-details.component.html',
  styleUrls: ['./varieties-details.component.scss'],
})
export class VarietiesDetailsComponent {
  p = 1;
  harvests: IHarvests[] = [];
  id!: string;
  product!: IProduct | undefined;
  options: IProductSubsetDTO[] = [];
  searchTypes: { label: string; value: ProductsSearchTypes }[] =
    searchConfig.PRODUCTS_TYPES;

  private destroy$ = new Subject();
  isLoading: boolean = true;
  selectInProgress = false;
  // cover: any;
  // defaultImage = config.DEFAULT_IMAGE;
  categories: ICategories[] = [];
  subcategories: ISubcategories[] = [];

  constructor(
    private productsService: GetProductsUseCase,
    private modalService: NgbModal,
    private activeEntityService: ActiveEntityService,
    private notifier: NotificationAdapter,
    private harvestService: GetHarvests,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Carga el buscador
    this.getCategories();
    this.getProductsList();
    this.getActiveEntityId();
    if (this.id) this.getProduct();
  }

  ngOnDestroy(): void {
    //this.activeEntityService.clearActiveEntity();
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  /*********************************BUSCADOR************************************/

  getActiveEntityId(): string | void {
    const result = this.activeEntityService.getActiveEntityId() || '';
    if (result) {
    }
    this.id = result;
  }

  getProductsList() {
    this.productsService
      .getAllProductsFiltered(ProductsType.MANCOMUNADOS)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (productsList: IProductSubsetDTO[]) => {
          this.options = productsList;
          if (productsList.length > 0) {
            const lastID = this.getLastProduct(productsList);
            if (lastID && !this.id) {
              this.id = lastID;
              this.getProduct();
            }
          } else {
            this.isLoading = true;
            this.product = undefined;
          }
        },
      });
  }

  getLastProduct(productList: IProductSubsetDTO[]): string | undefined {
    if (productList && productList.length > 0) {
      const lastProduct = productList[productList.length - 1];
      const lastProductId = lastProduct!.product_id;
      return lastProductId;
    }
    return undefined;
  }

  handleOptionSelected(option: any): void {
    if (!this.selectInProgress) {
      this.selectInProgress = true;
      this.id = option.product_id;
      this.getProduct();

      setTimeout(() => {
        this.selectInProgress = false;
      }, 100);
    }
  }

  /*********************************BUSCADOR************************************/

  /*************************************CARGA PRODUCTO**************************************/

  getProduct() {
    if (!this.checkProductSelected()) return;
    this.productsService
      .getProduct(this.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (product: IProduct) => {
          this.id = product.product_id!;
          this.product = product;
          //this.activeEntityService.setActiveEntity(this.product, this.id);
          this.isLoading = false;
          this.getAllHarvestByVariety();
        },
      });
  }

  getAllHarvestByVariety() {
    this.harvestService
      .getAllHarvestsByVariety(this.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (harvests: IHarvests[]) => {
          this.harvests = harvests;
        },
      });
  }

  openDetails(harvest: IHarvests) {
    this.activeEntityService.setActiveEntity(harvest, harvest.harvest_id!);
    this.router.navigateByUrl(PageRoutes.HARVESTS_DETAILS);
  }

  getCategories(): void {
    this.productsService
      .getAllCategories()
      .pipe(take(1))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories: ICategories[]) => {
          this.categories = categories;
          this.getSubCategories();
        },
      });
  }

  getSubCategories(): void {
    this.productsService
      .getAllSubcategories()
      .pipe(take(1))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (subcategories: ISubcategories[]) => {
          this.subcategories = this.subcategories = subcategories;
        },
      });
  }

  checkProductSelected(): boolean {
    if (!this.id) {
      this.notifier.showNotification('warning', 'Elige un producto primero');
      return false;
    }
    return true;
  }

  openCreateProductDialog() {
    const modalRef = this.modalService.open(
      CreateVarietiesComponent,
      modalEditOptions
    );
    modalRef.result
      .then((result) => {
        if (result) {
          this.id = '';
          this.getProductsList();
        }
      })
      .catch((error) => {
        if (error) console.error(error);
      });
  }

  openEditProductDialog() {
    if (!this.checkProductSelected()) return;
    const modalRef = this.modalService.open(
      EditVarietiesComponent,
      modalEditOptions
    );
    modalRef.componentInstance.uid = this.id;
    modalRef.result
      .then((result) => {
        if (result) {
          this.isLoading = true;
          this.getProduct();
        }
      })
      .catch((error) => {
        if (error) console.error(error);
      });
  }

  openCreateHarvestDialog() {
    const modalRef = this.modalService.open(
      CreateHarvestComponent,
      modalOptions
    );
    modalRef.componentInstance.varietyId = this.id;
    modalRef.result
      .then((result) => {
        if (result) {
        }
      })
      .catch((error) => {
        if (error) console.error(error);
      });
  }
  /*************************************CARGA PRODUCTO**************************************/

  formatDate(date: string): string {
    return DatetimeHelperService.dateToView(date);
  }

  getCategoryName(category_id: string): string {
    const category = this.categories.find(
      (cat) => cat.category_id === category_id
    );
    return category ? category.name : 'Categoría desconocida';
  }

  getSubcategoryNames(subcategory_ids: string[]): string {
    let subcategoriesNames = [];
    subcategoriesNames = this.subcategories
      .filter((sub) => subcategory_ids.includes(sub.subcategory_id.toString()))
      .map((sub) => sub.name);

    return subcategoriesNames.length > 0
      ? subcategoriesNames.join(', ')
      : 'Sin características';
  }

  getProductNames(product_ids: string[]): string {
    let productsName = [];
    productsName = this.options
      .filter((product) => product_ids.includes(product.product_id.toString()))
      .map((product) => product.name);

    return productsName.length > 0 ? productsName.join(', ') : 'Sin ancestros';
  }

  getProductStock(harvest: IHarvests) {
    return this.harvestService.getHarvestFinalStock(harvest);
  }
}
