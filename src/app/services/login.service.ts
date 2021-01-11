import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { server } from 'src/environments/environment';
import { DatosConJwt } from 'src/app/interfaces/interfaces'

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {
    console.log('servicio login funcionando');
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  // Método que busca usuario para iniciar sesión.
  searchUser(user: any): Observable<DatosConJwt> {
    const endpoint = `/usuario/autentica`;

    return this.http.post<DatosConJwt>(endpoint, user, this.httpOptions).pipe(
      // tap(data => {
      //   console.log(data["jwt"]);
      // })
    );
  }

}
