import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private platformId = inject(PLATFORM_ID);

  private registerUrl = 'http://localhost:8000/api/register/';
  private passwordResetBaseUrl = 'http://localhost:8000/api/password-reset/';

  constructor(private http: HttpClient, private router: Router) {}

  register(
    email: string,
    password: string,
    password2: string
  ): Observable<any> {
    return this.http.post(this.registerUrl, { email, password, password2 });
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(
      `${this.passwordResetBaseUrl}request-password-reset/`,
      { email }
    );
  }

  confirmPasswordReset(data: {
    uid: string;
    token: string;
    new_password: string;
    new_password_confirm: string;
  }): Observable<any> {
    return this.http.post(
      `${this.passwordResetBaseUrl}confirm-password-reset/`,
      data
    );
  }

  validateToken(token: string, id: string): Observable<{ success: boolean }> {
    console.log('VT ausgeführt');
    return this.http.post<{ success: boolean }>(
      'http://localhost:8000/api/validate-token/',
      { token, ID: parseInt(id, 10) }
    );
  }

  isLoggedIn(): Observable<boolean> {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      const id = localStorage.getItem('userId');

      console.log('Token:', token);
      console.log('ID:', id);

      if (!token?.trim() || !id?.trim()) return of(false);

      return this.validateToken(token, id).pipe(
        tap(() => console.log('ValidateToken wurde aufgerufen')),
        map((res) => {
          const valid = res.success === true;
          console.log('Token valid?', valid);
          return valid;
        }),
        catchError((err) => {
          console.error('Fehler beim Token-Check:', err);
          return of(false);
        })
      );
    }

    console.log('ende isLoggedIn');
    return of(false);
  }

  logOut(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userId');
    }
    this.router.navigate(['/login']);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post('http://localhost:8000/api/login/', {
      email,
      password,
    });
  }


}
