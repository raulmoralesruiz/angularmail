import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/interfaces';
import { AutenticadorJwtService } from 'src/app/services/autenticador-jwt.service';

import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private autenticadorJwtService: AutenticadorJwtService
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
    console.log('Usuario válido: ' + this.loginForm.controls.usuario.valid);

    let usuario: Usuario = {
      usuario: this.loginForm.controls.usuario.value,
      password: this.loginForm.controls.password.value
    }

    this.loginService.searchUser(usuario).subscribe(
      (user) => {
        if (user.jwt != undefined) {
          // console.log(user["jwt"]);
          console.log(user.jwt);

          this.autenticadorJwtService.almacenaJwt(user.jwt);
          this.router.navigate(['/listadoMensajes']);
        } else {
          console.log('Error. Credenciales incorrectas');
        }
      }/* ,
      (error) => {
        console.log(error);
      } */
    );
  }
}
