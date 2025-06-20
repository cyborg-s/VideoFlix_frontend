import { Component, Input, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

/**
 * Footer component displayed on pages, optionally customized for dashboard context.
 * 
 * Provides navigation methods to legal notice and imprint pages.
 * Detects if running in a browser environment and whether the device is mobile based on window width.
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  /**
   * Indicates if the footer is shown on the dashboard page.
   * Can be used to adjust styles or behavior.
   */
  @Input() isDashboard = false;

  /**
   * Flag that is true if the device is detected as mobile (window width <= 720px).
   */
  isMobile = false;

  /**
   * Creates an instance of Footer component.
   * @param router Router for navigation
   * @param platformId Injected platform identifier to detect if running in browser
   */
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /**
   * Lifecycle hook that runs after component initialization.
   * Checks if running in browser and sets `isMobile` based on window width.
   */
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth <= 720;
    }
  }

  /**
   * Navigates to the legal notice page.
   */
  goToLegalnotice(): void {
    this.router.navigate(['/legalnotice']);
  }

  /**
   * Navigates to the imprint page.
   */
  goToImprint(): void {
    this.router.navigate(['/imprint']);
  }
}
