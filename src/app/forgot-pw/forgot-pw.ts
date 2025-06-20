import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

/**
 * Component for the "Forgot Password" page.
 * 
 * Allows users to request a password reset email by entering their email address.
 * Displays toast messages for success, error, or validation feedback.
 */
@Component({
  selector: 'app-forgot-pw',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './forgot-pw.html',
  styleUrls: ['./forgot-pw.scss'],
})
export class ForgotPw {
  /** The user's email address input */
  email: string = '';

  /** Controls the visibility of the toast notification */
  showToast = false;

  /** The message displayed inside the toast notification */
  toastMessage = '';

  /**
   * Creates an instance of ForgotPw component.
   * @param route ActivatedRoute to access query parameters
   * @param authService Service to handle authentication-related actions
   * @param cdr ChangeDetectorRef to trigger change detection manually
   * @param ngZone NgZone to run change detection inside Angular zone
   */
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  /**
   * Lifecycle hook called after component initialization.
   * Subscribes to query parameters and initializes the email if provided.
   */
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'] || '';
    });
  }

  /**
   * Sends a password reset email request if the email is valid.
   * Shows appropriate toast messages on success, validation failure, or error.
   */
  sendEmail(): void {
    if (!this.email || this.email.trim() === '') {
      this.showToastMessage('Bitte gib eine gültige E-Mail-Adresse ein.');
      return;
    }

    this.authService.requestPasswordReset(this.email).subscribe({
      next: () => {
        this.showToastMessage(
          'Wenn die E-Mail existiert, wurde ein Link zum Zurücksetzen verschickt.'
        );
      },
      error: (error) => {
        console.error('Fehler beim Passwort-Reset Request:', error);
        this.showToastMessage(
          'Beim Senden der Anfrage ist ein Fehler aufgetreten. Bitte versuche es später erneut.'
        );
      },
    });
  }

  /**
   * Shows a toast message with the given text.
   * Runs inside Angular zone and triggers change detection.
   * @param message The message text to display in the toast
   */
  showToastMessage(message: string): void {
    this.ngZone.run(() => {
      this.toastMessage = message;
      this.showToast = true;
      this.cdr.detectChanges();
    });
  }

  /**
   * Closes the toast notification and triggers change detection.
   */
  closeToast(): void {
    this.showToast = false;
    this.cdr.detectChanges();
  }
}
