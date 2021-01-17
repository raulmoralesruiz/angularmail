import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ComunicacionDeAlertasService } from 'src/app/services/comunicacion-de-alertas.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-cambio-password',
  templateUrl: './cambio-password.component.html',
  styleUrls: ['./cambio-password.component.scss'],
})
export class CambioPasswordComponent implements OnInit {
  form: FormGroup;
  hideActual = true;
  hideNueva = true;

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private comunicacionAlertas: ComunicacionDeAlertasService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      actual: new FormControl('', [Validators.required]),
      nueva: new FormControl('', [Validators.required]),
    });
  }

  actualizarPassword() {
    this.comunicacionAlertas.abrirDialogoCargando();
    var actualEncriptada = this.encriptaMD5(this.form.controls.actual.value);
    
    this.usuarioService
      .ratificaPasswordUsuarioAutenticado(actualEncriptada)
      .subscribe((resultado) => {
        console.log(resultado);
        if (resultado['result'] == 'fail') {
          this.comunicacionAlertas.abrirDialogoError(
            'La contraseña actual introducida no es válida o no se puede comprobar'
          );
        } else {
          var nuevaEncriptada = this.encriptaMD5(
            this.form.controls.nueva.value
          ); 
          this.usuarioService
            .cambiaPasswordUsuarioAutenticado(nuevaEncriptada)
            .subscribe((resultado) => {
              if (resultado['result'] == 'fail') {
                this.comunicacionAlertas.abrirDialogoError(
                  'Error al actualizar la contraseña. Inténtelo más tarde.'
                );
              } else {
                this.comunicacionAlertas
                  .abrirDialogoInfo('Contraseña actualizada')
                  .subscribe((result) => {
                    this.router.navigate(['/listadoMensajes']);
                  });
              }
            });
        }
      });
  }

  encriptaMD5(texto: string): string {
    const md5 = new Md5();
    return md5.appendStr(texto).end().toString();
  }

  cancelar() {
    this.router.navigate(['/listadoMensajes']);
  }
}
