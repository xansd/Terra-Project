import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export enum FormMode {
  SLEEP = 'SLEEP',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
}

export interface IAppState {
  activeRoute: string;
  lastRoute: string;
  formMode: FormMode | string;
}

export interface IAppStateService {
  state: IAppState;
  getState(): Observable<IAppState>;
  addToState(prop: keyof IAppState, value: IAppState[keyof IAppState]): void;
}

@Injectable({
  providedIn: 'root',
})
export class AppStateService implements IAppStateService {
  state: IAppState = {
    activeRoute: '',
    lastRoute: '',
    formMode: FormMode.SLEEP,
  };
  private state$ = new BehaviorSubject<IAppState>(this.state);

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.state.activeRoute = event.url;
        this.state.lastRoute = this.state.activeRoute;
        this.addToState('activeRoute', event.url);
        this.addToState('lastRoute', event.url);
      }
    });
  }

  getState(): Observable<IAppState> {
    return this.state$.asObservable();
  }

  addToState(prop: keyof IAppState, value: IAppState[keyof IAppState]): void {
    this.state[prop] = value as string;
    this.state$.next(this.state);
  }

  cloneObject<T>(obj: T): T {
    return Object.assign({}, obj);
  }
}
