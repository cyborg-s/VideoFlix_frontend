import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, Observable } from 'rxjs';

/**
 * Guard that prevents authenticated users from accessing certain routes,
 * such as login or registration pages, by redirecting them to the dashboard.
 * 
 * Implements Angular's CanActivate interface to control route activation.
 */
@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {
  /**
   * Creates an instance of GuestGuard.
   * @param authService Service to check the user's authentication status
   * @param router Router service to perform navigation
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Determines whether a route can be activated.
   * Returns an Observable that emits true if the user is NOT logged in,
   * or redirects to '/dashboard' and emits false if the user is logged in.
   * 
   * @returns Observable<boolean> indicating whether route activation is allowed
   */
  canActivate(): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      map((isLoggedIn) => {
        if (isLoggedIn) {
          this.router.navigate(['/dashboard']);
          return false;
        }
        return true;
      })
    );
  }
}
