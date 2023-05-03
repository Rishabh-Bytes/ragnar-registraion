import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  environment = environment;
  constructor(private localStorageService: LocalStorageService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (this.localStorageService.getToken()) {
      request = request.clone({
        headers: request.headers
          .set('Authorization', `${this.localStorageService.getToken()}`)
          .set('x-api-key', this.environment.profilesApiKey),
      });
    } else {
      request = request.clone({
        headers: request.headers.set(
          'x-api-key',
          this.environment.profilesApiKey
        ),
      });
    }
    return next.handle(request);
  }
}
