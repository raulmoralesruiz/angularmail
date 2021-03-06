import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { server } from 'src/environments/environment';
import { ListadoMensajes, Mensaje, UsuarioData } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {

  public static readonly RECIBIDOS = 0;
  public static readonly ENVIADOS = 1;
  public static readonly SPAM = 2;
  public static readonly ARCHIVADOS = 3;

  constructor(private http: HttpClient) {
    console.log('servicio mensaje funcionando');
  }

  getListadoMensajes(tipo: number, pagina: number, lineasPorPagina: number): Observable<ListadoMensajes> {
    return this.http.get<ListadoMensajes>('/mensajes/listadoPorTipo?tipo=' + tipo + '&pagina=' + pagina + 
      '&mensajesPorPagina=' + lineasPorPagina).pipe(
//      tap(data => console.log(data)),
    );
  }

  accionSobreMensajes (ids: number[], tipoAccion: number) {
    var dto = {
      'ids': ids,
      'tipoAccion': tipoAccion
    };
    return this.http.post<string>('/mensajes/accionSobreMensajes', dto);
  }

  enviarNuevoMensaje (destinatarios: UsuarioData[], asunto: string, cuerpo: string) {
    var idsDestinatarios: number[] = [];
    destinatarios.forEach(usuario => idsDestinatarios.push(usuario.id)); 
    var dto = {
      'idsDestinatarios': idsDestinatarios,
      'asunto': asunto,
      'cuerpo': cuerpo
    };
    return this.http.put<string>('/mensajes/nuevo', dto);
  }

}
