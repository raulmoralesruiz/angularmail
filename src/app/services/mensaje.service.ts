import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { server } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {

  constructor(private http: HttpClient) {
    console.log('servicio mensaje funcionando');
  }

  /* httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  }; */

  getListadoMensajes(pagina: number, lineasPorPagina: number): Observable<object> {
      // return this.http.get<object>(`${server.ip}/mensajes/recibidos&pagina=` + pagina + '&mensajesPorPagina=' + lineasPorPagina).pipe(
      
      return this.http.get<object>(`/mensajes/recibidos?pagina=` + pagina + '&mensajesPorPagina=' + lineasPorPagina).pipe(
      // tap(data => console.log(data))
    )
  }
}
// localhost:8080/mensajes/recibidos?pagina=0&mensajesPorPagina=10
