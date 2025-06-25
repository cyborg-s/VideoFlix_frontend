/**
 * Component for user signup functionality.
 * 
 * Handles user input for email and password, performs validation,
 * communicates with the authentication service to register a new user,
 * and displays success or error toasts accordingly.
 */

import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './sign-up.html',
  styleUrls: ['./sign-up.scss'],
})
export class Signup implements OnInit {
  /** User email input */
  email: string = '';

  /** User password input */
  password: string = '';

  /** User repeated password input for confirmation */
  repeatedPassword: string = '';

  /** Controls visibility of password fields */
  showPassword: boolean = false;

  /** Controls visibility of error toast */
  showErrorToast = false;

  /** Error message content */
  errorMessage = '';

  /** Controls visibility of success toast */
  showSuccessToast = false;

  /** Success message content */
  successMessage = '';

  /** Password validation error message */
  passwordError: string = '';

  /**
   * Initializes the component and reads query parameters for email.
   * @param route Activated route to access query parameters.
   * @param router Angular router for navigation.
   * @param authService Service for authentication requests.
   * @param cdr ChangeDetectorRef to manually trigger change detection.
   * @param ngZone NgZone to run UI updates inside Angular zone.
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  /**
   * Lifecycle hook initializing the component,
   * reading the email query parameter if present.
   */
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'] || '';
    });
  }

  /**
   * Toggles the visibility of the password input fields.
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Initiates the user registration process after validation.
   * Displays appropriate success or error messages.
   */
signUp(): void {
  this.passwordError = '';
  this.showErrorToast = false;

  if (this.password !== this.repeatedPassword) {
    this.passwordError = 'Passwords must match.';
    this.cdr.detectChanges();
    return;
  }

  this.authService
    .register(this.email, this.password, this.repeatedPassword)
    .subscribe({
      next: (res) => {
        this.passwordError = '';
        this.showSuccessToastWithButton(
          res.message || 'Registration successful. Please confirm your email.'
        );
      },
      error: (err) => {
        let serverError = '';

        // Falls Backend-Fehler als Objekt mit Arrays vorliegen, alle Meldungen zusammenfassen
        if (err.error && typeof err.error === 'object') {
          // Beispiel: { password: [ "...", "..." ], email: [...] }
          const messages = [];

          for (const key in err.error) {
            if (Array.isArray(err.error[key])) {
              messages.push(...err.error[key]);
            } else if (typeof err.error[key] === 'string') {
              messages.push(err.error[key]);
            }
          }

          serverError = messages.join(' '); // Alle Fehler in einem String zusammenfügen
        } else if (typeof err.error === 'string') {
          serverError = err.error;
        }

        if (serverError) {
          this.showToast(serverError);
        } else {
          this.showToast('Please check your inputs and try again.');
        }
      },
    });
}

  /**
   * Shows an error toast with the specified message.
   * @param message The error message to display.
   */
  showToast(message: string): void {
    this.ngZone.run(() => {
      this.errorMessage = Array.isArray(message) ? message[0] : message;
      this.showErrorToast = true;
      this.cdr.detectChanges();
    });
  }

  /**
   * Closes the currently visible error toast.
   */
  closeToast(): void {
    this.showErrorToast = false;
    this.cdr.detectChanges();
  }

  /**
   * Shows a success toast with the specified message.
   * @param message The success message to display.
   */
  showSuccessToastWithButton(message: string): void {
    this.ngZone.run(() => {
      this.successMessage = Array.isArray(message) ? message[0] : message;
      this.showSuccessToast = true;
      this.cdr.detectChanges();
    });
  }

  /**
   * Handles user confirmation on success toast and navigates to the login page.
   */
  onSuccessToastOk(): void {
    this.showSuccessToast = false;
    this.cdr.detectChanges();
    this.router.navigate(['/login']);
  }
}
