import {
  Component,
  Input,
  Output,
  EventEmitter,
  Renderer2,
  OnDestroy,
} from '@angular/core';

interface NotificationData {
  icon: string;
  title: string;
  time: string;
}

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  host: {
    class: 'app-header',
  },
})
export class HeaderComponent {
  notificationData: NotificationData[] = [];
  username: string = 'xantimail@gmail.com';

  /*
	notificationData = [{
		icon: 'bi bi-bag text-theme',
		title: 'NEW ORDER RECEIVED ($1,299)',
		time: 'JUST NOW'
	}]
	*/

  handleAppToggleClass(event: MouseEvent, className: string) {
    event.preventDefault();

    var elm = document.getElementById('app');
    if (elm) {
      elm.classList.toggle(className);
    }
  }
}
