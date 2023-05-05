// Core Module
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CommonModule, JsonPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

// App Component
import { AppComponent } from './app.component';
import { PagesModule } from './pages/pages.module';
import { ComponentsModule } from './components/components.module';

@NgModule({
  declarations: [AppComponent],

  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    JsonPipe,
    HttpClientModule,
    BrowserAnimationsModule,
    PagesModule,
    ComponentsModule,
  ],
  exports: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  title: string = 'HUD';

  constructor(
    private router: Router,
    private titleService: Title,
    private route: ActivatedRoute
  ) {
    router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        if (
          this.route.snapshot.firstChild &&
          this.route.snapshot.firstChild.data['title']
        ) {
          this.title = 'HUD | ' + this.route.snapshot.firstChild.data['title'];
        }
        this.titleService.setTitle(this.title);

        var elm = document.getElementById('app');
        if (elm) {
          elm.classList.remove('app-sidebar-mobile-toggled');
        }
      }
    });
  }
}
