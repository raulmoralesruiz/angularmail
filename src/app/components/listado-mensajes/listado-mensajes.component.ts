import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ListadoMensajes, Mensaje, UsuarioData } from 'src/app/interfaces/interfaces';
import { ComunicacionDeAlertasService } from 'src/app/services/comunicacion-de-alertas.service';
import { MensajeService } from 'src/app/services/mensaje.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-listado-mensajes',
  templateUrl: './listado-mensajes.component.html',
  styleUrls: ['./listado-mensajes.component.scss']
})
export class ListadoMensajesComponent implements OnInit, AfterViewInit {
  usuarioAutenticado: UsuarioData;
  nombresDeColumnas: string[] = ['De', 'Asunto', 'Fecha'];
  listadoMensajes: ListadoMensajes = {
    mensajes: [],
    totalMensajes: 0
  };
  tipoListadoMensajes: number = 0;
  dataSourceTabla = new MatTableDataSource<Mensaje>(this.listadoMensajes.mensajes);

  constructor(private mensajesService: MensajeService,
    private comunicacionAlertas: ComunicacionDeAlertasService,
    private usuarioService: UsuarioService,
    private router: Router) { }

  ngOnInit(): void {
    this.usuarioService.getUsuarioAutenticado().subscribe(usuario => {
      if (usuario == null) {
        this.router.navigate(['/login']);
      }
      else {
        this.usuarioAutenticado = usuario;
      }
    });
  }

  ngAfterViewInit() {
    this.actualizaListadoMensajes();
  }

  actualizaListadoMensajes() {
    this.comunicacionAlertas.abrirDialogoCargando(); // Pantalla de carga
    
    this.mensajesService.getListadoMensajes(this.tipoListadoMensajes, 0, 10).subscribe(data => {
      if (data["result"] == "fail") { // Algo ha fallado
        this.comunicacionAlertas.abrirDialogoError('Imposible obtener los mensajes desde el servidor');
      }
      else {
        this.listadoMensajes = data;
        this.dataSourceTabla = new MatTableDataSource<Mensaje>(this.listadoMensajes.mensajes);
        this.comunicacionAlertas.cerrarDialogo();
      }
    });
  }

  seleccionarMensaje(mensaje: Mensaje) {
    console.log(mensaje);
  }

}
