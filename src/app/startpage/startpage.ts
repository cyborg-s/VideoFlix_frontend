import { Component } from '@angular/core';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-startpage',
  imports: [Header, Footer, FormsModule],
  templateUrl: './startpage.html',
  styleUrl: './startpage.scss'
})
export class Startpage {
   email: string = '';

  constructor(private router: Router) {}

  goToSignUp(): void {
    this.router.navigate(['/signup'], { queryParams: { email: this.email } });
  }
}
