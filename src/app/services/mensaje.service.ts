import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { server } from 'src/environments/environment';
import { ListadoMensajes, Mensaje } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {

  constructor(private http: HttpClient) {
    console.log('servicio mensaje funcionando');
  }

  getListadoMensajes(tipo: number, pagina: number, lineasPorPagina: number): Observable<ListadoMensajes> {
    return this.http.get<ListadoMensajes>('/mensajes/listadoPorTipo?tipo=' + tipo + '&pagina=' + pagina + 
      '&mensajesPorPagina=' + lineasPorPagina).pipe(
//      tap(data => console.log(data)),
    );
  }
}
