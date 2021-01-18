import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CambioPasswordComponent } from './components/cambio-password/cambio-password.component';
import { DatosUsuarioComponent } from './components/datos-usuario/datos-usuario.component';
import { ListadoMensajesComponent } from './components/listado-mensajes/listado-mensajes.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'listadoMensajes',
    component: ListadoMensajesComponent
  },
  {
    path: 'cambioPassword',
    component: CambioPasswordComponent
  },
  {
    path: 'datosUsuario',
    component: DatosUsuarioComponent
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
