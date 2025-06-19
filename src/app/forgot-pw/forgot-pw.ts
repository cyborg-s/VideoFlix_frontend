import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-pw',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './forgot-pw.html',
  styleUrls: ['./forgot-pw.scss'],
})
export class ForgotPw {
  email: string = '';

  showToast = false;
  toastMessage = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'] || '';
    });
  }

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

  showToastMessage(message: string): void {
    this.ngZone.run(() => {
      this.toastMessage = message;
      this.showToast = true;
      this.cdr.detectChanges();
    });
  }

  closeToast() {
    this.showToast = false;
    this.cdr.detectChanges();
  }
}
