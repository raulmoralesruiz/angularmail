import { Component, OnInit } from '@angular/core';

import { ComunicacionDeAlertasService } from '../../services/comunicacion-de-alertas.service';
import { DialogTypes } from '../dialogo-general/dialog-data-type';
import { AutenticadorJwtService } from '../../services/autenticador-jwt.service';
import { Router } from '@angular/router';
import { Usuario, UsuarioData } from '../../interfaces/interfaces';
import { UsuarioService } from '../../services/usuario.service';


@Component({
  selector: 'app-barra-herramientas',
  templateUrl: './barra-herramientas.component.html',
  styleUrls: ['./barra-herramientas.component.scss']
})
export class BarraHerramientasComponent implements OnInit {

  usuarioAutenticado: UsuarioData;

  constructor(
    private comunicacionAlertasService: ComunicacionDeAlertasService,
    private autenticacionPorJWT: AutenticadorJwtService,
    private router: Router,
    private usuarioService: UsuarioService,
  ) { }

  ngOnInit(): void {
    this.usuarioService.cambiosEnUsuarioAutenticado.subscribe(nuevoUsuarioAutenticado => {
      this.usuarioAutenticado = nuevoUsuarioAutenticado;
    })
  }

  navegarHaciaPrincipal() {
    this.router.navigate(['/listadoMensajes']);
  }

  confirmacionAbandonarSesion() {
    this.comunicacionAlertasService.abrirDialogoConfirmacion('¿Realmente desea abandonar la sesión?').subscribe(opcionElegida => {
      if (opcionElegida == DialogTypes.RESPUESTA_ACEPTAR) {
        this.autenticacionPorJWT.eliminaJwt();
        this.usuarioAutenticado = null;
        this.router.navigate(['/login']);
      }
    });
  }

  navegarHaciaCambiaPassword () {
    this.router.navigate(['/cambioPassword'])
  }

  navegarHaciaDatosPersonales () {
    this.router.navigate(['/datosUsuario'])
  }

}