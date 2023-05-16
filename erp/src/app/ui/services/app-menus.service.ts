import { Injectable } from '@angular/core';
import { PageIcon } from '../pages/pages-info.config';

@Injectable({
  providedIn: 'root',
})
export class AppMenuService {
  getAppMenus() {
    return [
      { text: 'General', is_header: true },
      { path: '/inicio', icon: PageIcon.HOME, text: 'Inicio' },
      { is_divider: true },
      { text: 'Aplicación', is_header: true },
      { path: '/usuarios', text: 'Usuarios', icon: PageIcon.USERS },
    ];
  }
}
