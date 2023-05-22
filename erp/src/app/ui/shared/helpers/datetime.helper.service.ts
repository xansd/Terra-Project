import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DatetimeHelperService {
  constructor() {}

  getFormattedDate(d: any): string {
    if (d) {
      const date = new Date(d);
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // Agrega un 0 al mes si es de un solo dígito
      const day = ('0' + date.getDate()).slice(-2); // Agrega un 0 al día si es de un solo dígito
      return `${year}/${month}/${day}`;
    } else {
      return 'Sin datos';
    }
  }
}
