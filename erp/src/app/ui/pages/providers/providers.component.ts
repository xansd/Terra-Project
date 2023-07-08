import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { PageIcon, PageRoutes } from '../pages-info.config';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.scss'],
})
export class ProvidersComponent {
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
