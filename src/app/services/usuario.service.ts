import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Md5 } from 'ts-md5/dist/md5';
import { tap } from 'rxjs/operators';

import { DatosConJwt, Usuario, UsuarioData } from 'src/app/interfaces/interfaces'

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  usuarioAutenticado: UsuarioData;
  @Output()
  cambiosEnUsuarioAutenticado = new EventEmitter<UsuarioData>();

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

    return this.http
      .post<DatosConJwt>(endpoint, user, this.httpOptions)
      .pipe
      // tap(data => {
      //   console.log(data["jwt"]);
      // })
      ();
  }

  getUsuarioAutenticado(incluirImagen: boolean = false): Observable<UsuarioData> {
    return this.http
      .get<UsuarioData>('/usuario/getAutenticado?imagen=' + incluirImagen)
      .pipe(
        tap((usuarioAutenticado) => {
          if (
            (this.usuarioAutenticado == null && usuarioAutenticado != null) ||
            (this.usuarioAutenticado != null && usuarioAutenticado == null) ||
            (this.usuarioAutenticado != null && usuarioAutenticado == null &&
              this.usuarioAutenticado.id != usuarioAutenticado.id)
          ) {
            this.emitirNuevoCambioEnUsuarioAutenticado();
            this.usuarioAutenticado = usuarioAutenticado;
          }
        })
      );
  }

  emitirNuevoCambioEnUsuarioAutenticado() {
    this.getUsuarioAutenticado(true).subscribe((usuarioAutenticado) => {
      this.cambiosEnUsuarioAutenticado.emit(usuarioAutenticado);
    });
  }
}
