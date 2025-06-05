import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [FormsModule],
  templateUrl: './sign-up.html',
  styleUrls: ['./sign-up.scss'],
})
export class Signup implements OnInit {
  email: string = '';
  password: string = '';
  repeatedPassword: string = '';

  showPassword: boolean = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  signUp(): void {
    console.log('E-Mail:', this.email);
    console.log('Passwort:', this.password);
    console.log('Wiederholung:', this.repeatedPassword);

    if (this.password !== this.repeatedPassword) {
      alert('Passwörter stimmen nicht überein');
      return;
    }

    // Deine Registrierung/Backend-Logik hier
  }
}
