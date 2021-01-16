import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Usuario } from 'src/app/interfaces/interfaces';
import { AutenticadorJwtService } from 'src/app/services/autenticador-jwt.service';
import { ComunicacionDeAlertasService } from 'src/app/services/comunicacion-de-alertas.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  ocultarPassword: boolean = true;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private autenticadorJwtService: AutenticadorJwtService,
    private comunicacionDeAlertasService: ComunicacionDeAlertasService,
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      usuario: new FormControl('rafa', [
        Validators.required,
        Validators.minLength(4),
      ]),
      password: new FormControl('1234', [
        Validators.required,
      ]),
    });
  }

  // Método que autentica al usuario
  autenticaUsuario() {
    this.comunicacionDeAlertasService.abrirDialogoCargando();

    let usuario: Usuario = {
      usuario: this.loginForm.controls.usuario.value,
      password: this.loginForm.controls.password.value
    }

    this.usuarioService.searchUser(usuario).subscribe(
      (user) => {
        if (user.jwt != undefined) {
          this.autenticadorJwtService.almacenaJwt(user.jwt);
          this.router.navigate(['/listadoMensajes']);
          this.comunicacionDeAlertasService.cerrarDialogo();
          this.usuarioService.emitirNuevoCambioEnUsuarioAutenticado();
        } else {
          this.comunicacionDeAlertasService.abrirDialogoError('Error. Credenciales incorrectas');
        }
      }/* ,
      (error) => {
        console.log(error);
      } */
    );
  }
}
