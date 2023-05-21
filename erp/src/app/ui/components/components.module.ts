import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { HeaderComponent } from '../shared/components/header/header.component';
import { NavScrollComponent } from './nav-scroll/nav-scroll.component';
import { SidebarMobileBackdropComponent } from '../shared/components/sidebar-mobile-backdrop/sidebar-mobile-backdrop.component';
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
import { SidebarComponent } from '../shared/components/sidebar/sidebar.component';
import { CheckPasswordComponent } from './check-password/check-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material.module';
import { PartnerFormDataComponent } from './partner-form-data/partner-form-data.component';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';

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
    CheckPasswordComponent,
    PartnerFormDataComponent,
    FileUploaderComponent,
  ],
  imports: [
    CommonModule,
    NgScrollbarModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
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
    PartnerFormDataComponent,
    FileUploaderComponent,
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
