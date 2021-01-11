import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AutenticadorJwtService {
  // jwtPorSesion: string; // utilizado si queremos varias sesiones en el mismo navegador

  constructor() { }

  almacenaJwt(token: string) {
    // this.jwtPorSesion = token;        // almacenar token en variable (varias sesiones en mismo navegador)
    localStorage.setItem("jwt", token);  // almacenar token en localStorage (1 sesión por navegador)
  }

  recuperaJwt(): string {
    // return this.jwtPorSesion;          // obtener token desde variable
    return localStorage.getItem("jwt");   // obtener token desde localStorage
  }

  eliminaJwt() {
    // this.jwtPorSesion = null;        // "eliminar" token desde variable
    localStorage.removeItem("jwt");     // eliminar token desde localStorage
  }
}
