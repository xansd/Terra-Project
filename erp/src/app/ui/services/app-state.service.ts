import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export interface IAppState {
  activeRoute: string;
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
  };
  private state$ = new BehaviorSubject<IAppState>(this.state);

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.state.activeRoute = event.url;
        this.addToState('activeRoute', event.url);
      }
    });
  }

  getState(): Observable<IAppState> {
    return this.state$.asObservable();
  }

  addToState(prop: keyof IAppState, value: IAppState[keyof IAppState]): void {
    this.state[prop] = value;
    this.state$.next(this.state);
  }

  cloneArrayOfObjects<T>(data: T[]): T[] {
    return data.map((obj) => Object.assign({}, obj));
  }

  cloneObject<T>(obj: T): T {
    return Object.assign({}, obj);
  }
}
