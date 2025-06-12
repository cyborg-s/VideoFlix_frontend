import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-startpage',
  imports: [FormsModule],
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
