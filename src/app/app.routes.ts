/**
 * Application route definitions for Angular Router.
 * Each route specifies the path, the component to load, 
 * route guards for access control, and optional resolvers for data fetching.
 */

import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/puplic.guard';
import { dashboardResolver } from './dashboard/resolver';
import { VideoDetailResolver } from './video-detail/detail.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./startpage/startpage').then((m) => m.Startpage),
    canActivate: [GuestGuard],
  },
  {
    path: 'signup',
    loadComponent: () => import('./sign-up/sign-up').then((m) => m.Signup),
    canActivate: [GuestGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((m) => m.Login),
    canActivate: [GuestGuard],
  },
  {
    path: 'imprint',
    loadComponent: () => import('./imprint/imprint').then((m) => m.Imprint),
  },
  {
    path: 'legalnotice',
    loadComponent: () =>
      import('./legalnotice/legalnotice').then((m) => m.Legalnotice),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [AuthGuard],
    resolve: { categories: dashboardResolver },
  },
  {
    path: 'video/:id',
    loadComponent: () =>
      import('./video-detail/video-detail').then((m) => m.VideoDetail),
    canActivate: [AuthGuard],
    resolve: {
      video: VideoDetailResolver,
    },
  },
  {
    path: 'password-reset/:uid/:token',
    loadComponent: () =>
      import('./password-reset/password-reset').then((m) => m.PasswordReset),
    canActivate: [GuestGuard],
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./forgot-pw/forgot-pw').then((m) => m.ForgotPw),
    canActivate: [GuestGuard],
  },
  {
    path: 'player/:id',
    loadComponent: () =>
      import('./player/player').then((m) => m.VideoPlayerComponent),
    canActivate: [AuthGuard],
  },
];
