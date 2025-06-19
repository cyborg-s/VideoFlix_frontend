import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  @Input() isDashboard = false;
  isMobile = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth <= 720;
    }
  }

  goToLegalnotice(): void {
    this.router.navigate(['/legalnotice']);
  }

  goToImprint(): void {
    this.router.navigate(['/imprint']);
  }
}
