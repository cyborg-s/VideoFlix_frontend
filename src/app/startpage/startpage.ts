/**
 * Component representing the start page of the application.
 * 
 * Provides a simple interface for users to enter their email and navigate to the signup page,
 * optionally passing the entered email as a query parameter.
 */

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-startpage',
  imports: [FormsModule],
  templateUrl: './startpage.html',
  styleUrl: './startpage.scss',
})
export class Startpage {
  /** The email entered by the user on the start page. */
  email: string = '';

  /**
   * Creates an instance of the Startpage component.
   * @param router Angular Router service for navigation.
   */
  constructor(private router: Router) {}

  /**
   * Navigates to the signup page, passing the current email as a query parameter.
   */
  goToSignUp(): void {
    this.router.navigate(['/signup'], { queryParams: { email: this.email } });
  }
}
