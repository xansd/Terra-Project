import { Component, OnDestroy } from '@angular/core';
import { Subject, Subscription, map, takeUntil } from 'rxjs';
import { AppStateService, IAppState } from '../services/app-state.service';
import { PageRoutes, PageTitle, PageIcon } from './pages-info.config';

export interface IPageInfo {
  pageHeader: string;
  icon: string;
  description?: string;
}

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnDestroy {
  activeRoute$: Subscription;
  private destroy$ = new Subject();
  activeRoute = PageRoutes.LOGIN;
  hideBreadcrumbRoutes = [PageRoutes.LOGIN, PageRoutes.RESET_PASSWORD];

  info: IPageInfo = {
    pageHeader: PageTitle.HOME,
    icon: PageIcon.HOME,
  };

  constructor(private appStateService: AppStateService) {
    this.activeRoute$ = this.appStateService
      .getState()
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: IAppState) => {
        this.activeRoute = state.activeRoute as PageRoutes;
        this.generatePageInfo(state.activeRoute);
      });
  }

  ngAfterViewInit() {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  /**
   * Configura la informacion de la página en base a la ruta actual
   * @param {string} route ruta actual
   */
  generatePageInfo(route: string): void {
    switch (route) {
      case PageRoutes.HOME:
        this.info = {
          pageHeader: PageTitle.HOME,
          icon: PageIcon.HOME,
        };
        break;
      case PageRoutes.USERS:
      case PageRoutes.USERS_LIST:
      case PageRoutes.USERS_ONLINE:
        this.info = {
          pageHeader: PageTitle.USERS,
          icon: PageIcon.USERS,
        };
        break;
      case PageRoutes.PARTNERS:
      case PageRoutes.PARTNERS_LIST:
      case PageRoutes.PARTNER_DETAILS:
        this.info = {
          pageHeader: PageTitle.PARTNERS,
          icon: PageIcon.PARTNERS,
        };
        break;
      case PageRoutes.VARIETIES:
      case PageRoutes.VARIETIES_LIST:
      case PageRoutes.VARIETIES_STATISTICS:
      case PageRoutes.VARIETIES_DETAILS:
        this.info = {
          pageHeader: PageTitle.VARIETIES,
          icon: PageIcon.VARIETIES,
        };
        break;
      case PageRoutes.PRODUCTS:
      case PageRoutes.PRODUCTS_LIST:
      case PageRoutes.PRODUCTS_STATISTICS:
      case PageRoutes.PRODUCTS_DETAILS:
        this.info = {
          pageHeader: PageTitle.PRODUCTS,
          icon: PageIcon.PRODUCTS,
        };
        break;

      case PageRoutes.HARVESTS:
      case PageRoutes.HARVESTS_LIST:
      case PageRoutes.HARVESTS_STATISTICS:
      case PageRoutes.HARVESTS_DETAILS:
        this.info = {
          pageHeader: PageTitle.HARVESTS,
          icon: PageIcon.HARVESTS,
        };
        break;

      case PageRoutes.PURCHASES:
      case PageRoutes.PURCHASES_LIST:
      case PageRoutes.PURCHASES_STATISTICS:
      case PageRoutes.PURCHASES_DETAILS:
        this.info = {
          pageHeader: PageTitle.PURCHASES,
          icon: PageIcon.PURCHASES,
        };
        break;

      case PageRoutes.CULTIVATORS:
      case PageRoutes.CULTIVATORS_LIST:
      case PageRoutes.CULTIVATORS_STATISTICS:
      case PageRoutes.CULTIVATORS_DETAILS:
        this.info = {
          pageHeader: PageTitle.CULTIVATORS,
          icon: PageIcon.CULTIVATORS,
        };
        break;

      case PageRoutes.PROVIDERS:
      case PageRoutes.PROVIDERS_LIST:
      case PageRoutes.PROVIDERS_STATISTICS:
      case PageRoutes.PROVIDERS_DETAILS:
        this.info = {
          pageHeader: PageTitle.PROVIDERS,
          icon: PageIcon.PROVIDERS,
        };
        break;

      case PageRoutes.RECORDS:
      case PageRoutes.RECORDS_DETAILS:
      case PageRoutes.TRANSACTIONS_LIST:
      case PageRoutes.PAYMENTS_LIST:
        this.info = {
          pageHeader: PageTitle.RECORDS,
          icon: PageIcon.RECORDS,
        };
        break;

      case PageRoutes.BALANCE:
        this.info = {
          pageHeader: PageTitle.BALANCE,
          icon: PageIcon.BALANCE,
        };
        break;
    }
  }
}
