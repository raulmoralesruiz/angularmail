import { Component, Input, OnInit } from '@angular/core';
import { UsuarioData } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-imagen-usuario',
  templateUrl: './imagen-usuario.component.html',
  styleUrls: ['./imagen-usuario.component.scss']
})
export class ImagenUsuarioComponent implements OnInit {

  @Input('usuario') usuario: UsuarioData;
  @Input('width') width: number;
  @Input('height') height: number;

  constructor() { }

  ngOnInit(): void {
  }

}
