import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {
  constructor(private router: Router) {}

  goToLegalnotice(): void {
    this.router.navigate(['/legalnotice']);
  }

  goToImprint(): void {
    this.router.navigate(['/imprint']);
  }
}
