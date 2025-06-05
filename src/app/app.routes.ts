import { Routes } from '@angular/router';


export const routes: Routes = [
  { path: '', loadComponent: () => import('./startpage/startpage').then(m => m.Startpage) },
  { path: 'signup', loadComponent: () => import('./sign-up/sign-up').then(m => m.Signup) },
  { path: 'login', loadComponent: () => import('./login/login').then(m => m.Login) },
  { path: 'imprint', loadComponent: () => import('./imprint/imprint').then(m => m.Imprint) },
  { path: 'legalnotice', loadComponent: () => import('./legalnotice/legalnotice').then(m => m.Legalnotice) },
  { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard) },
  { path: 'password-reset', loadComponent: () => import('./password-reset/password-reset').then(m => m.PasswordReset) },
];