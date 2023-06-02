import { Injectable } from '@angular/core';
import {
  NgbDateParserFormatter,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root',
})
export class DatetimeHelperService {
  constructor(private ngbDateParserFormatter: NgbDateParserFormatter) {}

  static fromDatePickerDate(d: any): string {
    if (d) {
      const date = new Date(d);
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // Agrega un 0 al mes si es de un solo dígito
      const day = ('0' + date.getDate()).slice(-2); // Agrega un 0 al día si es de un solo dígito
      return `${year}-${month}-${day}`;
    } else {
      return 'Sin datos';
    }
  }

  static dateToString(date: any): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  static dateToView(d: any): string {
    const date = new Date(d);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    const formattedDate = `${formattedDay}-${formattedMonth}-${year}`;

    return formattedDate;
  }

  toDatePickerFormat(date: string): NgbDateStruct {
    return this.ngbDateParserFormatter.parse(date) as NgbDateStruct;
  }
}
