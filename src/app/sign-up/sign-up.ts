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
  email: string = '';
  password: string = '';
  repeatedPassword: string = '';
  showPassword: boolean = false;

  showErrorToast = false;
  errorMessage = '';
  showSuccessToast = false;
  successMessage = '';

  passwordError: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'] || '';
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

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
            res.message || 'Registrierung erfolgreich. Bitte E-Mail bestätigen.'
          );
        },
        error: (err) => {
          const serverError =
            err.error?.password?.[0] ||
            err.error?.email?.[0] ||
            err.error?.non_field_errors?.[0];

          if (serverError) {
            this.showToast(serverError);
          } else if (typeof err.error === 'string') {
            this.showToast(err.error);
          } else {
            this.showToast(
              'Bitte überprüfe deine Eingaben und versuche es erneut.'
            );
          }
        },
      });
  }

  showToast(message: string): void {
    this.ngZone.run(() => {
      this.errorMessage = Array.isArray(message) ? message[0] : message;
      this.showErrorToast = true;
      this.cdr.detectChanges();
    });
  }

  closeToast() {
    this.showErrorToast = false;
    this.cdr.detectChanges();
  }

  showSuccessToastWithButton(message: string): void {
    this.ngZone.run(() => {
      this.successMessage = Array.isArray(message) ? message[0] : message;
      this.showSuccessToast = true;
      this.cdr.detectChanges();
    });
  }

  onSuccessToastOk(): void {
    this.showSuccessToast = false;
    this.cdr.detectChanges();
    this.router.navigate(['/login']);
  }
}
