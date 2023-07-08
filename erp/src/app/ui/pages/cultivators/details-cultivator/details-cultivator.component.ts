import { Component } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { ProductsType } from 'src/app/products/domain/products';
import { GetProviders } from 'src/app/providers/application/get-providers.use-cases';
import { IProvider } from 'src/app/providers/domain/providers';
import { DatetimeHelperService } from 'src/app/shared/application/datetime.helper.service';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import searchConfig, {
  ProviderSearchTypes,
} from 'src/app/ui/components/searcher/search.config';
import { ActiveEntityService } from 'src/app/ui/services/active-entity-service.service';
import { EditCultivatorComponent } from '../edit-cultivator/edit-cultivator.component';
import { CreateCultivatorComponent } from '../create-cultivator/create-cultivator.component';
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
  selector: 'app-details-cultivator',
  templateUrl: './details-cultivator.component.html',
  styleUrls: ['./details-cultivator.component.scss'],
})
export class DetailsCultivatorComponent {
  p = 1;
  harvests: IHarvests[] = [];
  id!: string;
  provider!: IProvider | undefined;
  options: IProvider[] = [];
  searchTypes: { label: string; value: ProviderSearchTypes }[] =
    searchConfig.PROVIDERS_TYPES;

  private destroy$ = new Subject();
  isLoading: boolean = true;
  selectInProgress = false;

  constructor(
    private providersService: GetProviders,
    private modalService: NgbModal,
    private activeEntityService: ActiveEntityService,
    private notifier: NotificationAdapter,
    private harvestService: GetHarvests,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Carga el buscador
    this.getProvidersList();
    this.getActiveEntityId();
    if (this.id) this.getProvider();
  }

  ngOnDestroy(): void {
    // this.activeEntityService.clearActiveEntity();
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  /*********************************BUSCADOR************************************/

  getActiveEntityId(): string | void {
    const result = this.activeEntityService.getActiveEntityId() || '';
    if (result) this.id = result;
  }

  getProvidersList() {
    this.providersService
      .getAll(ProductsType.MANCOMUNADOS)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (providersList: IProvider[]) => {
          this.options = providersList;
          if (providersList.length > 0) {
            const lastID = this.getLastProvider(providersList);
            if (lastID && !this.id) {
              this.id = lastID;
              this.getProvider();
            }
          } else {
            this.isLoading = true;
            this.provider = undefined;
          }
        },
      });
  }

  getLastProvider(providerList: IProvider[]): string | undefined {
    if (providerList && providerList.length > 0) {
      const lastProvider = providerList[providerList.length - 1];
      const lastProviderId = lastProvider!.provider_id;
      return lastProviderId;
    }
    return undefined;
  }

  handleOptionSelected(option: any): void {
    if (!this.selectInProgress) {
      this.selectInProgress = true;
      this.id = option.provider_id;
      this.getProvider();

      setTimeout(() => {
        this.selectInProgress = false;
      }, 100);
    }
  }

  /*********************************BUSCADOR************************************/

  /*************************************CARGA ProviderO**************************************/

  getProvider() {
    if (!this.checkProviderSelected()) return;
    this.providersService
      .getById(this.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (provider: IProvider) => {
          this.id = provider.provider_id!;
          this.provider = provider;
          // this.activeEntityService.setActiveEntity(this.provider, this.id);
          this.isLoading = false;
          this.getAllHarvestCultivator();
        },
      });
  }

  getAllHarvestCultivator() {
    this.harvestService
      .getAllHarvestsByCultivator(this.id)
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

  checkProviderSelected(): boolean {
    if (!this.id) {
      this.notifier.showNotification('warning', 'Elige un proveedor primero');
      return false;
    }
    return true;
  }

  openCreateProviderDialog() {
    const modalRef = this.modalService.open(
      CreateCultivatorComponent,
      modalOptions
    );
    modalRef.result
      .then((result) => {
        if (result) {
          this.id = '';
          this.getProvidersList();
        }
      })
      .catch((error) => {
        if (error) console.error(error);
      });
  }

  openEditProviderDialog() {
    if (!this.checkProviderSelected()) return;
    const modalRef = this.modalService.open(
      EditCultivatorComponent,
      modalOptions
    );
    modalRef.componentInstance.uid = this.id;
    modalRef.result
      .then((result) => {
        if (result) {
          this.isLoading = true;
          this.getProvider();
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
    modalRef.componentInstance.cultivatorId = this.id;
    modalRef.result
      .then((result) => {
        if (result) {
        }
      })
      .catch((error) => {
        if (error) console.error(error);
      });
  }
  /*************************************CARGA ProviderO**************************************/

  formatDate(date: string): string {
    return DatetimeHelperService.dateToView(date);
  }

  getProductStock(harvest: IHarvests) {
    return this.harvestService.getHarvestFinalStock(harvest);
  }
}
