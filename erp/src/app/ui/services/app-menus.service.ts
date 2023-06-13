import { Injectable } from '@angular/core';
import { PageIcon, PageRoutes, PageTitle } from '../pages/pages-info.config';
@Injectable({
  providedIn: 'root',
})
export class AppMenuService {
  getAppMenus() {
    return [
      { text: 'General', is_header: true },
      { path: PageRoutes.HOME, icon: PageIcon.HOME, text: PageTitle.HOME },
      { is_divider: true },
      { text: 'Asociación', is_header: true },
      {
        path: PageRoutes.PARTNERS,
        icon: PageIcon.PARTNERS,
        text: PageTitle.PARTNERS,
      },
      {
        path: PageRoutes.VARIETIES,
        icon: PageIcon.VARIETIES,
        text: PageTitle.VARIETIES,
      },
      { is_divider: true },
      { text: 'Ajustes', is_header: true },
      { path: PageRoutes.USERS, icon: PageIcon.USERS, text: PageTitle.USERS },
    ];
  }
}
