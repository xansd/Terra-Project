import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { PageIcon, PageRoutes } from '../pages-info.config';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent {
  @ViewChild('nav') nav!: ElementRef;
  isNavFixed = false;
  icons = PageIcon;
  pagesRoutes = PageRoutes;
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const element = this.nav.nativeElement;
    const viewportOffset = element.getBoundingClientRect();
    const top = viewportOffset.top;
    return (this.isNavFixed = top <= 50);
  }
}
