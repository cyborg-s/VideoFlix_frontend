import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      map((isLoggedIn) => {
  console.log('isLoggedIn in Guard:', );
  if (!isLoggedIn) {
    console.log('Redirecting to /login');
    this.router.navigate(['/login']);
    return false;
  }
  return true;
})
    );
  }
}
