import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { DialogTypes } from '../components/dialogo-general/dialog-data-type';
import { DialogoGeneralComponent } from '../components/dialogo-general/dialogo-general.component';

@Injectable({
  providedIn: 'root',
})
export class ComunicacionDeAlertasService {
  dialogConfig = new MatDialogConfig();

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar) {
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
  }

  abrirDialogoCargando() {
    this.cerrarDialogo();
    this.dialogConfig.data = {
      tipoDialogo: DialogTypes.ESPERANDO,
    };
    this.dialog.open(DialogoGeneralComponent, this.dialogConfig);
  }

  abrirDialogoError(textoDeError: string) {
    this.cerrarDialogo();
    this.dialogConfig.data = {
      tipoDialogo: DialogTypes.ERROR,
      texto: textoDeError,
    };
    this.dialog.open(DialogoGeneralComponent, this.dialogConfig);
  }

  abrirDialogoInfo(textoDeInfo: string): Observable<number> {
    this.cerrarDialogo();
    this.dialogConfig.data = {
      tipoDialogo: DialogTypes.INFORMACION,
      texto: textoDeInfo,
    };
    const dialogRef = this.dialog.open(
      DialogoGeneralComponent,
      this.dialogConfig
    );
    return dialogRef.afterClosed();
  }

  abrirDialogoConfirmacion(textoDeConfirmacion: string): Observable<number> {
    this.cerrarDialogo();
    this.dialogConfig.data = {
      tipoDialogo: DialogTypes.CONFIRMACION,
      texto: textoDeConfirmacion,
    };
    const dialogRef = this.dialog.open(
      DialogoGeneralComponent,
      this.dialogConfig
    );
    return dialogRef.afterClosed();
  }

  cerrarDialogo() {
    this.dialog.closeAll();
  }

  mostrarSnackBar(mensajeAMostrar: string) {
    this.snackBar.open(mensajeAMostrar, null, {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
