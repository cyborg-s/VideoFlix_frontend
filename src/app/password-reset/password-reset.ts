import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './password-reset.html',
  styleUrls: ['./password-reset.scss']
})
export class PasswordReset {
  password: string = '';
  repeatedPassword: string = '';
  showPassword: boolean = false;
  uid: string = '';
  token: string = '';

  toastMessage = '';
  showToast = false;
  passwordError = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.uid = params['uid'];
      this.token = params['token'];
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

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
      new_password_confirm: this.repeatedPassword
    };

    this.authService.confirmPasswordReset(payload).subscribe({
      next: () => {
        this.showToastMessage('Passwort erfolgreich geändert.');
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (error) => {
        console.error(error);
        const msg = error?.error?.detail || 'Fehler beim Zurücksetzen des Passworts.';
        this.showToastMessage(msg);
      }
    });
  }

  showToastMessage(message: string): void {
    this.ngZone.run(() => {
      this.toastMessage = message;
      this.showToast = true;
      this.cdr.detectChanges();

      
    });
  }

  closeToast(){
    this.showToast = false;
    this.cdr.detectChanges();
  }
}
