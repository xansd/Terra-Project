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
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
import { FileService } from 'src/app/files/application/files.service';
import { FilesAPIRepository } from 'src/app/files/infrastructure/files-api.repository';
import { FileDownloaderComponent } from './file-downloader/file-downloader.component';

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
    FileUploaderComponent,
    FileDownloaderComponent,
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
    FileUploaderComponent,
    FileDownloaderComponent,
  ],
  providers: [
    {
      provide: NG_SCROLLBAR_OPTIONS,
      useValue: {
        visibility: 'hover',
      },
    },
    { provide: 'filesAPI', useClass: FilesAPIRepository },
    { provide: 'fileService', useClass: FileService },
  ],
})
export class ComponentsModule {}
