import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { server } from 'src/environments/environment';
import { AutenticadorJwtService } from './autenticador-jwt.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  urlWebApi = server.ip;

  constructor(private autenticadorJwt: AutenticadorJwtService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string = this.autenticadorJwt.recuperaJwt();

    if (token) {
      request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) })
    }

    if (!request.headers.has('Content-Type')) {
      request = request.clone({ headers: request.headers.set('Content-Type', 'application/json; charset=utf-8') });
    }

    request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

    const newUrl = { url: this.urlWebApi + request.url };
    request = Object.assign(request, newUrl);
    const newUrlWithParams = { urlWithParams: this.urlWebApi + request.urlWithParams };
    request = Object.assign(request, newUrlWithParams);    

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log('event ---> ', event);
        }
        return event;
      }),
      finalize(() => {
      })
    );
  }
}
