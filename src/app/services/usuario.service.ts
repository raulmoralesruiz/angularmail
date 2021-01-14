import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Md5 } from 'ts-md5/dist/md5';
import { tap } from 'rxjs/operators';

import { DatosConJwt, Usuario } from 'src/app/interfaces/interfaces'

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor(private http: HttpClient) {
    console.log('servicio usuario funcionando');
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  // Método que busca usuario para iniciar sesión.
  searchUser(user: Usuario): Observable<DatosConJwt> {
    const md5 = new Md5();
    const endpoint = `/usuario/autentica`;

    user.password = md5.appendStr(user.password).end().toString();
    

    return this.http.post<DatosConJwt>(endpoint, user, this.httpOptions).pipe(
      // tap(data => {
      //   console.log(data["jwt"]);
      // })
    );
  }

}
