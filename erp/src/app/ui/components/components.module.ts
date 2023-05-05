import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { NavScrollComponent } from './nav-scroll/nav-scroll.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarMobileBackdropComponent } from './sidebar-mobile-backdrop/sidebar-mobile-backdrop.component';
import { ThemePanelComponent } from './theme-panel/theme-panel.component';
import {
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  CardFooterComponent,
  CardImgOverlayComponent,
  CardGroupComponent,
  CardExpandTogglerComponent,
} from './card/card.component';
import { RouterModule } from '@angular/router';
import { NgScrollbarModule, NG_SCROLLBAR_OPTIONS } from 'ngx-scrollbar';

@NgModule({
  declarations: [
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    CardFooterComponent,
    CardImgOverlayComponent,
    CardGroupComponent,
    CardExpandTogglerComponent,
    FooterComponent,
    HeaderComponent,
    NavScrollComponent,
    SidebarComponent,
    SidebarMobileBackdropComponent,
    ThemePanelComponent,
  ],
  imports: [CommonModule, NgScrollbarModule, RouterModule],
  exports: [
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    CardFooterComponent,
    CardImgOverlayComponent,
    CardGroupComponent,
    CardExpandTogglerComponent,
    FooterComponent,
    HeaderComponent,
    NavScrollComponent,
    SidebarComponent,
    SidebarMobileBackdropComponent,
    ThemePanelComponent,
  ],
  providers: [
    {
      provide: NG_SCROLLBAR_OPTIONS,
      useValue: {
        visibility: 'hover',
      },
    },
  ],
})
export class ComponentsModule {}
