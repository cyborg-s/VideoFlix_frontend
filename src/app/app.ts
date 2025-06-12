import { Component, Inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

import { Header } from './header/header';
import { Footer } from './footer/footer';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Footer, Header, CommonModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  isDashboardRoute = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          document.body.className = '';

          const url = event.urlAfterRedirects;

          if (url === '/' || url === '') {
            document.body.classList.add('startpage-background');
          } else if (
            url.startsWith('/login') ||
            url.startsWith('/password-reset') ||
            url.startsWith('/forgot-password')
          ) {
            document.body.classList.add('login-background');
          } else if (url.startsWith('/signup')) {
            document.body.classList.add('signup-background');
          } else {
            document.body.classList.add('background');
          }
        }
      });
    }

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isDashboardRoute = this.router.url === '/dashboard';
      });
  }
}
