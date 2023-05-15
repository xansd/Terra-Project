import { Component } from '@angular/core';
import { PageIcon } from '../pages-info.config';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  icons = PageIcon;
}
