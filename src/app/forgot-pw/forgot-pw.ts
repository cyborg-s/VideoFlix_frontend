import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Pfad ggf. anpassen

@Component({
  selector: 'app-forgot-pw',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './forgot-pw.html',
  styleUrl: './forgot-pw.scss'
})
export class ForgotPw {
  email: string = '';
  password: string = '';

  constructor(private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });
  }

  sendEmail(): void {
    if (!this.email || this.email.trim() === '') {
      alert('Bitte gib eine gültige E-Mail-Adresse ein.');
      return;
    }

    this.authService.requestPasswordReset(this.email).subscribe({
      next: (response: any) => {
        alert('Wenn die E-Mail existiert, wurde ein Link zum Zurücksetzen verschickt.');
        console.log('Response:', response);
      },
      error: (error) => {
        console.error('Fehler beim Passwort-Reset Request:', error);
        alert('Beim Senden der Anfrage ist ein Fehler aufgetreten. Bitte versuche es später erneut.');
      }
    });
  }
}
