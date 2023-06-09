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
import { SearcherComponent } from './searcher/searcher.component';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { UpdateAccessCodeComponent } from './update-access-code/update-access-code.component';
import { PartnerHistoryComponent } from './partner-history/partner-history.component';
import { SanctionsComponent } from './sanctions/sanctions.component';
import { UpdatePartnerCashComponent } from './update-partner-cash/update-partner-cash.component';
import { TextEditorComponent } from './text-editor/text-editor.component';
import { NgxEditorModule } from 'ngx-editor';

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
    SearcherComponent,
    UpdateAccessCodeComponent,
    PartnerHistoryComponent,
    SanctionsComponent,
    UpdatePartnerCashComponent,
    TextEditorComponent,
  ],
  imports: [
    CommonModule,
    NgScrollbarModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgbTypeaheadModule,
    NgxEditorModule.forRoot({
      locals: {
        // menu
        bold: 'Bold',
        italic: 'Italic',
        code: 'Code',
        underline: 'Underline',
        strike: 'Strike',
        blockquote: 'Blockquote',
        bullet_list: 'Bullet List',
        ordered_list: 'Ordered List',
        heading: 'Heading',
        h1: 'Header 1',
        h2: 'Header 2',
        h3: 'Header 3',
        h4: 'Header 4',
        h5: 'Header 5',
        h6: 'Header 6',
        align_left: 'Left Align',
        align_center: 'Center Align',
        align_right: 'Right Align',
        align_justify: 'Justify',
        text_color: 'Text Color',
        background_color: 'Background Color',
        insertLink: 'Insert Link',
        removeLink: 'Remove Link',
        insertImage: 'Insert Image',

        // pupups, forms, others...
        url: 'URL',
        text: 'Text',
        openInNewTab: 'Open in new tab',
        insert: 'Insert',
        altText: 'Alt Text',
        title: 'Title',
        remove: 'Remove',
      },
    }),
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
    SearcherComponent,
    PartnerHistoryComponent,
    TextEditorComponent,
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
