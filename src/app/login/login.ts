import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  errorMessage: string = '';
  showToast: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const uidb64 = params['uidb64'];
      const token = params['token'];

      if (uidb64 && token) {
        const url = `http://localhost:8000/api/activate/${uidb64}/${token}/`;
        this.http.get(url).subscribe({
          next: () => {
            this.showToast = true;
            this.cdr.detectChanges();
            setTimeout(() => {
              this.showToast = false;
              this.cdr.detectChanges();
            }, 3000);
          },
          error: (error) => {
            console.error('Aktivierung fehlgeschlagen:', error);
          }
        });
      }
    });
  }

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
            this.cdr.detectChanges();
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
