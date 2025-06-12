import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-signup',
  standalone: true, // wichtig für standalone component
  imports: [FormsModule, HttpClientModule],
  templateUrl: './sign-up.html',
  styleUrls: ['./sign-up.scss'],  // styleUrls (Plural) statt styleUrl
})
export class Signup implements OnInit {
  email: string = '';
  password: string = '';
  repeatedPassword: string = '';
  showPassword: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  signUp(): void {
    if (!this.email || !this.password || !this.repeatedPassword) {
      alert('Bitte alle Felder ausfüllen.');
      return;
    }

    if (this.password !== this.repeatedPassword) {
      alert('Passwörter stimmen nicht überein');
      return;
    }

    this.authService.register(this.email, this.password, this.repeatedPassword).subscribe({
      next: (res) => {
        alert(res.message || 'Registrierung erfolgreich. Bitte E-Mail bestätigen.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        const errorMsg =
          err.error?.password || err.error?.email || err.error?.non_field_errors || 'Registrierung fehlgeschlagen.';
        alert(errorMsg);
      },
    });
  }
}
