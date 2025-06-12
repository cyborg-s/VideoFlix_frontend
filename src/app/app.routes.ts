import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/puplic.guard';



export const routes: Routes = [
  { path: '', loadComponent: () => import('./startpage/startpage').then(m => m.Startpage), canActivate: [GuestGuard] },
  { path: 'signup', loadComponent: () => import('./sign-up/sign-up').then(m => m.Signup), canActivate: [GuestGuard] },
  { path: 'login', loadComponent: () => import('./login/login').then(m => m.Login), canActivate: [GuestGuard] },
  { path: 'imprint', loadComponent: () => import('./imprint/imprint').then(m => m.Imprint) },
  { path: 'legalnotice', loadComponent: () => import('./legalnotice/legalnotice').then(m => m.Legalnotice) },
  { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard), canActivate: [AuthGuard] },
  { path: 'password-reset/:uid/:token', loadComponent: () => import('./password-reset/password-reset').then(m => m.PasswordReset), canActivate: [GuestGuard] },
  { path: 'forgot-password', loadComponent: () => import('./forgot-pw/forgot-pw').then(m => m.ForgotPw), canActivate: [GuestGuard] },
];