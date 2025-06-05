import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        document.body.className = ''; // reset

        const url = event.urlAfterRedirects;

        if (url === '/' || url === '') {
          // Startseite
          document.body.classList.add('startpage-background');
        } else if (url.startsWith('/login')) {
          document.body.classList.add('login-background');
        } else if (url.startsWith('/signup')) {
          document.body.classList.add('signup-background');
        } else {
          // Alle anderen Seiten, z.B. dashboard, imprint, legalnotice, etc.
          document.body.classList.add('background');
        }
      }
    });
  }
}
