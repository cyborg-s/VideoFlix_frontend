/**
 * Service handling user authentication tasks including registration,
 * login, logout, password reset, and token validation.
 */
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private platformId = inject(PLATFORM_ID);

  private registerUrl = 'http://localhost:8000/api/register/';
  private passwordResetBaseUrl = 'http://localhost:8000/api/password-reset/';

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Registers a new user with email and password.
   * @param email User's email address.
   * @param password User's password.
   * @param password2 Confirmation of user's password.
   * @returns Observable with the registration response.
   */
  register(
    email: string,
    password: string,
    password2: string
  ): Observable<any> {
    return this.http.post(this.registerUrl, { email, password, password2 });
  }

  /**
   * Requests a password reset email for the given email address.
   * @param email User's email address.
   * @returns Observable with the response of the request.
   */
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(
      `${this.passwordResetBaseUrl}request-password-reset/`,
      { email }
    );
  }

  /**
   * Confirms a password reset with new password data.
   * @param data Object containing uid, token, new password and confirmation.
   * @returns Observable with the response of the confirmation.
   */
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

  /**
   * Validates the authentication token and user ID.
   * @param token Authentication token.
   * @param id User ID as string.
   * @returns Observable with a success boolean indicating validity.
   */
  validateToken(token: string, id: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(
      'http://localhost:8000/api/validate-token/',
      { token, ID: parseInt(id, 10) }
    );
  }

  /**
   * Checks if the user is currently logged in by validating the stored token.
   * Returns false if not running in a browser environment.
   * @returns Observable emitting true if logged in, false otherwise.
   */
  isLoggedIn(): Observable<boolean> {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      const id = localStorage.getItem('userId');

      if (!token?.trim() || !id?.trim()) return of(false);

      return this.validateToken(token, id).pipe(
        map((res) => res.success === true),
        catchError(() => of(false))
      );
    }

    return of(false);
  }

  /**
   * Logs out the current user by clearing stored credentials
   * and redirecting to the login page.
   */
  logOut(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userId');
    }
    this.router.navigate(['/login']);
  }

  /**
   * Logs in the user with provided email and password.
   * @param email User's email address.
   * @param password User's password.
   * @returns Observable with the login response.
   */
  login(email: string, password: string): Observable<any> {
    return this.http.post('http://localhost:8000/api/login/', {
      email,
      password,
    });
  }
}
