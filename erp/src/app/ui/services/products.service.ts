import { Injectable } from '@angular/core';
import { ICategories, ProductsType } from 'src/app/products/domain/products';
import { PageRoutes } from '../pages/pages-info.config';
import { AppStateService } from './app-state.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private appState: AppStateService) {}

  filterCategoriesAllowed(categories: ICategories[]): ICategories[] {
    let filteredCategories: ICategories[] = [];
    const currentURL = this.appState.state.activeRoute;
    if (
      currentURL === PageRoutes.PRODUCTS_LIST ||
      // currentURL === PageRoutes.PRODUCTS_DETAILS ||
      currentURL === PageRoutes.PRODUCTS ||
      currentURL === PageRoutes.PRODUCTS_STATISTICS
    ) {
      filteredCategories = categories.filter(
        (cat) => cat.type === ProductsType.TERCEROS
      );
    } else if (
      currentURL === PageRoutes.VARIETIES_LIST ||
      currentURL === PageRoutes.VARIETIES_DETAILS ||
      currentURL === PageRoutes.VARIETIES ||
      currentURL === PageRoutes.VARIETIES_STATISTICS
    ) {
      filteredCategories = categories.filter(
        (cat) => cat.type === ProductsType.MANCOMUNADOS
      );
    }
    return filteredCategories;
  }
}
