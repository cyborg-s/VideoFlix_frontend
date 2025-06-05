import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [NgIf],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  constructor(public router: Router){}
  

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
  goToStartpage(): void {
    this.router.navigate(['/']);
  }
}