import { Component, OnInit } from '@angular/core';
import { MensajeService } from 'src/app/services/mensaje.service';

@Component({
  selector: 'app-listado-mensajes',
  templateUrl: './listado-mensajes.component.html',
  styleUrls: ['./listado-mensajes.component.scss']
})
export class ListadoMensajesComponent implements OnInit {

  constructor(private mensajeService: MensajeService) { }

  ngOnInit(): void {
    this.mensajeService.getListadoMensajes(0, 10).subscribe(res => {
      console.log(res);
    },
    (error) => {
      console.log(error);
    })
  }

}
