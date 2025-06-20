import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

/**
 * Component for handling password reset functionality.
 * 
 * Allows the user to enter a new password and confirm it.
 * Retrieves UID and token from route parameters to verify the password reset request.
 * Shows success or error messages via toast notifications.
 */
@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './password-reset.html',
  styleUrls: ['./password-reset.scss'],
})
export class PasswordReset {
  /** New password entered by the user */
  password: string = '';

  /** Confirmation of the new password */
  repeatedPassword: string = '';

  /** Whether the password input should be visible (not masked) */
  showPassword: boolean = false;

  /** User ID extracted from route parameters */
  uid: string = '';

  /** Password reset token extracted from route parameters */
  token: string = '';

  /** Message displayed in the toast notification */
  toastMessage = '';

  /** Whether the toast notification is visible */
  showToast = false;

  /** Error message shown when passwords do not match */
  passwordError = '';

  /**
   * Creates an instance of PasswordReset component.
   * @param route ActivatedRoute to access route parameters
   * @param router Router for navigation after successful password reset
   * @param authService Service to communicate with authentication backend
   * @param cdr ChangeDetectorRef to trigger UI updates
   * @param ngZone NgZone to run UI updates inside Angular zone
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  /**
   * Lifecycle hook runs after component initialization.
   * Subscribes to route parameters to extract UID and token for password reset.
   */
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.uid = params['uid'];
      this.token = params['token'];
    });
  }

  /**
   * Toggles the visibility of the password input fields.
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Initiates the password reset process.
   * Validates that the password and confirmation match.
   * Calls AuthService to confirm password reset.
   * Shows toast messages for success or error and navigates to login on success.
   */
  resetPw(): void {
    this.passwordError = '';
    if (this.password !== this.repeatedPassword) {
      this.passwordError = 'Passwords must match.';
      this.cdr.detectChanges();
      return;
    }

    const payload = {
      uid: this.uid,
      token: this.token,
      new_password: this.password,
      new_password_confirm: this.repeatedPassword,
    };

    this.authService.confirmPasswordReset(payload).subscribe({
      next: () => {
        this.showToastMessage('Passwort erfolgreich geändert.');
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (error) => {
        console.error(error);
        const msg =
          error?.error?.detail || 'Fehler beim Zurücksetzen des Passworts.';
        this.showToastMessage(msg);
      },
    });
  }

  /**
   * Displays a toast notification with the provided message.
   * Ensures changes run inside Angular zone and triggers change detection.
   * @param message Message to display in the toast
   */
  showToastMessage(message: string): void {
    this.ngZone.run(() => {
      this.toastMessage = message;
      this.showToast = true;
      this.cdr.detectChanges();
    });
  }

  /**
   * Closes the toast notification.
   * Triggers change detection to update the UI.
   */
  closeToast(): void {
    this.showToast = false;
    this.cdr.detectChanges();
  }
}
