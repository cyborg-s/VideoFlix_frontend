import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../services/auth.service'; // Pfad ggf. anpassen

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  logIn(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userEmail', response.email);
        localStorage.setItem('userId', response.user_id);
        this.errorMessage = '';
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        if (error.status === 400) {
          this.errorMessage = typeof error.error === 'string'
            ? error.error
            : JSON.stringify(error.error);

          if (typeof error.error === 'object') {
            this.errorMessage = Object.values(error.error).flat().join(' ');
          }
        } else {
          alert('Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
        }
      }
    });
  }

  goToForgotPassword(): void {
    this.router.navigate(['/forgot-password'], {
      queryParams: { email: this.email },
    });
  }

  goToSignUp(): void {
    this.router.navigate(['/signup'], {
      queryParams: { email: this.email },
    });
  }
}
