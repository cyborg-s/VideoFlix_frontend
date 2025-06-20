/**
 * HTTP interceptor that appends an Authorization header with a token
 * from local storage to outgoing HTTP requests if a token is present.
 */

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  /**
   * Intercepts HTTP requests and adds an Authorization header
   * with the token from localStorage if available.
   * 
   * @param req The outgoing HTTP request.
   * @param next The next interceptor or backend handler in the chain.
   * @returns An observable of the HTTP event stream.
   */
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('authToken');

    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Token ${token}`),
      });
      return next.handle(cloned);
    }

    return next.handle(req);
  }
}
