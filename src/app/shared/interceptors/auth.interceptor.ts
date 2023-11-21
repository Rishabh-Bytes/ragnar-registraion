import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
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
      if (request.headers.get("skip")){
        return next.handle(request);
      } else {
        request = request.clone({
          headers: request.headers
            .set('Authorization', `${this.localStorageService.getToken()}`)
            .set('x-api-key', this.environment.profilesApiKey),
        });
      }
    } else {
      request = request.clone({
        headers: request.headers.set(
          'x-api-key',
          this.environment.profilesApiKey
        ),
      });
    }
    // return next.handle(request);
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        if (error.status == 401) {
          localStorage.clear();
          window.location.href = '';
        }
        // if (error.status == 500) {
          // this.shared.presentToast(error.statusText + '. ' + 'please try again later');
          // this.router.navigate(['/']);
        // }
        return throwError(error);
      })
    );
  }
}
