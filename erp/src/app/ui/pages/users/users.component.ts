import { Component } from '@angular/core';
import { PageIcon, PageRoutes } from '../pages-info.config';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  icons = PageIcon;
  usersRoutes = PageRoutes;
  constructor() {}
}
