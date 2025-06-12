import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service'; // Pfad ggf. anpassen

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
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
    if (this.password !== this.repeatedPassword || this.password.length < 6) {
      alert('Passwörter stimmen nicht überein oder sind zu kurz.');
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
        alert('Passwort erfolgreich geändert.');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error(error);
        alert(error?.error?.detail || 'Fehler beim Zurücksetzen des Passworts.');
      }
    });
  }
}
