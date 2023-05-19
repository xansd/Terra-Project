import { Component } from '@angular/core';
import { PageIcon, PageRoutes } from '../pages-info.config';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.scss'],
})
export class PartnersComponent {
  icons = PageIcon;
  pagesRoutes = PageRoutes;
}
