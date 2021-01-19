import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Mensaje, UsuarioData } from 'src/app/interfaces/interfaces';
import { ComunicacionDeAlertasService } from 'src/app/services/comunicacion-de-alertas.service';
import { MensajeService } from 'src/app/services/mensaje.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-detalle-mensaje',
  templateUrl: './detalle-mensaje.component.html',
  styleUrls: ['./detalle-mensaje.component.scss'],
})
export class DetalleMensajeComponent implements OnInit {
  usuarioRemitente: UsuarioData;
  usuarioAutenticado: UsuarioData;

  constructor(
    @Inject(MAT_DIALOG_DATA) public mensaje: Mensaje,
    private usuarioService: UsuarioService,
    private dialogRef: MatDialogRef<DetalleMensajeComponent>,
    private mensajeService: MensajeService,
    private comunicacionDeAlertas: ComunicacionDeAlertasService
  ) {}

  ngOnInit(): void {
    this.usuarioService
      .getUsuario(this.mensaje.remitente.id, true)
      .subscribe((usuarioObtenido) => {
        this.usuarioRemitente = usuarioObtenido;
      });
    this.usuarioService
      .getUsuarioAutenticado()
      .subscribe((usuario) => (this.usuarioAutenticado = usuario));
    this.accionSobreMensajes(0);
  }

  volver() {
    this.dialogRef.close();
  }

  botonArchivarHabilitado() {
    return (
      !this.mensaje.archivado &&
      !this.mensaje.spam &&
      this.usuarioAutenticado != null &&
      this.usuarioAutenticado.id != this.mensaje.remitente.id
    );
  }

  botonSpamHabilitado() {
    return (
      !this.mensaje.archivado &&
      !this.mensaje.spam &&
      this.usuarioAutenticado != null &&
      this.usuarioAutenticado.id != this.mensaje.remitente.id
    );
  }

  botonEliminarHabilitado() {
    return (
      this.mensaje.fechaEliminacion == null &&
      this.usuarioAutenticado != null &&
      this.usuarioAutenticado.id != this.mensaje.remitente.id
    );
  }

  botonMoverARecibidosHabilitado() {
    return this.mensaje.archivado || this.mensaje.spam;
  }

  accionSobreMensajes(tipoAccion: number) {
    this.mensajeService
      .accionSobreMensajes([this.mensaje.id], tipoAccion)
      .subscribe((strResult) => {
        if (strResult['result'] == 'fail') {
          if (tipoAccion != 0) {
            this.comunicacionDeAlertas.mostrarSnackBar(
              'Error al realizar la operación. Inténtelo más tarde.'
            );
          }
        } else {
          if (tipoAccion != 0) {
            this.volver();
          }
        }
      });
  }
}
