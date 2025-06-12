import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { isPlatformBrowser, CommonModule } from '@angular/common';  // CommonModule importieren
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,  // wichtig für standalone components
  imports: [CommonModule],  // Hier das CommonModule einfügen
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header implements OnInit {
  isLoggedIn = false;
  currentUrl = '';
  private platformId: Object;

  constructor(
    public router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.platformId = platformId;
  }

  ngOnInit() {
    this.checkLoginStatus();
    this.currentUrl = this.router.url;

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl = event.urlAfterRedirects;
      this.checkLoginStatus();
    });
  }

  checkLoginStatus() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      this.isLoggedIn = !!token;
    } else {
      this.isLoggedIn = false;
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToStartpage(): void {
    this.router.navigate(['/']);
  }

  logOut() {
    this.authService.logOut();
  }
}
