/**
 * Bootstraps the Angular application by initializing the root component and 
 * configuring providers, including HTTP client with interceptors.
 * 
 * This setup includes the authentication interceptor to handle auth-related 
 * HTTP requests globally.
 */

import { bootstrapApplication } from '@angular/platform-browser';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { AuthInterceptor } from './app/services/auth.interceptor';

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
}).catch((err) => console.error(err));
