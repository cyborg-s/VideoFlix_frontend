import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';

/**
 * Component responsible for user login functionality.
 * 
 * Manages user credentials input, password visibility toggle,
 * login request, and navigation on success or error.
 * Also handles account activation via URL query parameters.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  /** User's email input */
  email: string = '';

  /** User's password input */
  password: string = '';

  /** Flag to toggle password visibility */
  showPassword: boolean = false;

  /** Error message displayed on login failure */
  errorMessage: string = '';

  /** Controls visibility of activation success toast */
  showToast: boolean = false;

  /**
   * Creates an instance of Login component.
   * @param authService Service for authentication operations
   * @param router Router service for navigation
   * @param cdr ChangeDetectorRef for manual change detection
   * @param route ActivatedRoute to access route query parameters
   * @param http HttpClient to perform HTTP requests
   */
  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  /**
   * Angular lifecycle hook that initializes component.
   * Checks for activation parameters in query string and triggers account activation.
   */
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
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
          },
        });
      }
    });
  }

  /**
   * Toggles the visibility of the password input field.
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Attempts to log in the user with the provided email and password.
   * On success, stores authentication info and navigates to dashboard.
   * On failure, displays appropriate error messages.
   */
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
          this.errorMessage =
            typeof error.error === 'string'
              ? error.error
              : JSON.stringify(error.error);

          if (typeof error.error === 'object') {
            this.errorMessage = Object.values(error.error).flat().join(' ');
            this.cdr.detectChanges();
          }
        } else {
          alert('Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
        }
      },
    });
  }

  /**
   * Navigates to the "Forgot Password" page, passing the current email as a query parameter.
   */
  goToForgotPassword(): void {
    this.router.navigate(['/forgot-password'], {
      queryParams: { email: this.email },
    });
  }

  /**
   * Navigates to the "Sign Up" page, passing the current email as a query parameter.
   */
  goToSignUp(): void {
    this.router.navigate(['/signup'], {
      queryParams: { email: this.email },
    });
  }
}
