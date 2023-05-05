import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppMenuService {
  getAppMenus() {
    return [
      { text: 'Menú', is_header: true },
      { path: '/inicio', icon: 'bi bi-house-door', text: 'Inicio' },
    ];
  }
}
