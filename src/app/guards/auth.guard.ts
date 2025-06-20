import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, Observable } from 'rxjs';

/**
 * Route guard that protects routes from unauthorized access.
 * 
 * Checks if the user is logged in via the AuthService.
 * If the user is not logged in, redirects to the login page.
 * 
 * Implements Angular's CanActivate interface to control route activation.
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  /**
   * Creates an instance of AuthGuard.
   * @param authService Service to check user's authentication status
   * @param router Router service to navigate programmatically
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Determines whether a route can be activated.
   * Returns an Observable that emits true if the user is logged in,
   * or redirects to '/login' and emits false if not.
   * 
   * @returns Observable<boolean> indicating whether route activation is allowed
   */
  canActivate(): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      map((isLoggedIn) => {
        if (!isLoggedIn) {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      })
    );
  }
}
