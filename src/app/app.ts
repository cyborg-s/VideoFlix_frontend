import { Component, Inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { filter } from 'rxjs';

/**
 * The root component of the application.
 * It manages global styles based on the current route
 * and determines if the dashboard route is active.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Footer, Header, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  /**
   * Indicates whether the current route is the dashboard route.
   */
  isDashboardRoute = false;

  /**
   * Initializes the root component.
   * Subscribes to router navigation events and updates
   * the body class based on the active route.
   *
   * @param router - The Angular router used to listen for navigation events.
   * @param platformId - The platform ID used to check if the app is running in a browser.
   */
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          const url = event.urlAfterRedirects;


          document.body.className = '';
          
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

          this.isDashboardRoute = url === '/dashboard';
        });
    }
  }
}
