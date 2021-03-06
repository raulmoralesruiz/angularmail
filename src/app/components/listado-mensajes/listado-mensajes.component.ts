import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ListadoMensajes, Mensaje, UsuarioData } from 'src/app/interfaces/interfaces';
import { ComunicacionDeAlertasService } from 'src/app/services/comunicacion-de-alertas.service';
import { MensajeService } from 'src/app/services/mensaje.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DetalleMensajeComponent } from '../detalle-mensaje/detalle-mensaje.component';
import { NuevoMensajeComponent } from '../nuevo-mensaje/nuevo-mensaje.component';

@Component({
  selector: 'app-listado-mensajes',
  templateUrl: './listado-mensajes.component.html',
  styleUrls: ['./listado-mensajes.component.scss'],
})
export class ListadoMensajesComponent implements OnInit, AfterViewInit {
  usuarioAutenticado: UsuarioData;
  nombresDeColumnas: string[] = ['Select', 'De', 'Asunto', 'Fecha'];
  listadoMensajes: ListadoMensajes = {
    mensajes: [],
    totalMensajes: 0,
  };
  tipoListadoMensajes: number = 0;
  dataSourceTabla = new MatTableDataSource<Mensaje>(
    this.listadoMensajes.mensajes
  );
  selection = new SelectionModel<Mensaje>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private mensajesService: MensajeService,
    private comunicacionAlertas: ComunicacionDeAlertasService,
    private usuarioService: UsuarioService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.usuarioService.getUsuarioAutenticado().subscribe((usuario) => {
      if (usuario == null) {
        this.router.navigate(['/login']);
      } else {
        this.usuarioAutenticado = usuario;
      }
    });
  }

  ngAfterViewInit() {
    this.configuraEtiquetasDelPaginador();
    this.actualizaListadoMensajes();
  }

  private configuraEtiquetasDelPaginador() {
    this.paginator._intl.itemsPerPageLabel = 'Mensajes por página';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.previousPageLabel = 'Anterior';
    this.paginator._intl.firstPageLabel = 'Primera';
    this.paginator._intl.lastPageLabel = 'Última';
    this.paginator._intl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ) => {
      const start = page * pageSize + 1;
      const end = (page + 1) * pageSize;
      return `${start} - ${end} de ${length}`;
    };
  }

  actualizaListadoMensajes() {
    this.comunicacionAlertas.abrirDialogoCargando();

    this.mensajesService
      .getListadoMensajes(
        this.tipoListadoMensajes,
        this.paginator.pageIndex,
        this.paginator.pageSize
      )
      .subscribe((data) => {
        if (data['result'] == 'fail') {
          this.comunicacionAlertas.abrirDialogoError(
            'Imposible obtener los mensajes desde el servidor'
          );
        } else {
          this.listadoMensajes = data;
          this.dataSourceTabla = new MatTableDataSource<Mensaje>(
            this.listadoMensajes.mensajes
          );
          this.comunicacionAlertas.cerrarDialogo();
        }
      });
  }

  seleccionarMensaje(mensaje: Mensaje) {
    const dialogRef = this.dialog.open(DetalleMensajeComponent, {
      width: '100%',
      height: '90%',
      data: mensaje,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.actualizaListadoMensajes();
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceTabla.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSourceTabla.data.forEach((row) => this.selection.select(row));
  }

  checkboxLabel(row?: Mensaje): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.id + 1
    }`;
  }

  cambioEnTiposDeMensajesVisualizados(indiceTiposDeMensajeSeleccionado) {
    this.paginator.firstPage();

    this.tipoListadoMensajes = indiceTiposDeMensajeSeleccionado;
    this.actualizaListadoMensajes();
  }

  getIdsMensajesSeleccionados(): number[] {
    var idsMensajesSeleccionados = [];
    this.selection.selected.forEach((item, index) => {
      idsMensajesSeleccionados.push(item.id);
    });
    return idsMensajesSeleccionados;
  }

  accionSobreMensajes(tipoAccion: number) {
    this.mensajesService
      .accionSobreMensajes(this.getIdsMensajesSeleccionados(), tipoAccion)
      .subscribe((strResult) => {
        if (strResult['result'] == 'fail') {
          this.comunicacionAlertas.abrirDialogoError(
            'Error al realizar la operación. Inténtelo más tarde.'
          );
        } else {
          this.actualizaListadoMensajes();
        }
      });
  }

  getTextoColumnaRemitente(mensaje: Mensaje) {
    if (this.usuarioAutenticado.id != mensaje.remitente.id) {
      return 'De: ' + mensaje.remitente.nombre;
    } else {
      var str: string = 'Para: ';
      mensaje.destinatarios.forEach(function (destinatario, i, destinatarios) {
        str += destinatario.nombre;
        if (i < destinatarios.length - 1) {
          str += ', ';
        }
      });
      return str;
    }
  }

  hayAlgunElementoSeleccionadoEnTabla(): boolean {
    return this.selection.selected.length > 0;
  }

  botonArchivarHabilitado(): boolean {
    return (
      this.tipoListadoMensajes == MensajeService.RECIBIDOS &&
      this.hayAlgunElementoSeleccionadoEnTabla()
    );
  }

  botonSpamHabilitado(): boolean {
    return (
      this.tipoListadoMensajes == MensajeService.RECIBIDOS &&
      this.hayAlgunElementoSeleccionadoEnTabla()
    );
  }

  botonEliminarHabilitado(): boolean {
    return (
      this.tipoListadoMensajes != MensajeService.ENVIADOS &&
      this.hayAlgunElementoSeleccionadoEnTabla()
    );
  }

  botonMoverARecibidosHabilitado(): boolean {
    return (
      (this.tipoListadoMensajes == MensajeService.SPAM ||
        this.tipoListadoMensajes == MensajeService.ARCHIVADOS) &&
      this.hayAlgunElementoSeleccionadoEnTabla()
    );
  }

  nuevoMensaje() {
    const dialogRef = this.dialog.open(NuevoMensajeComponent, {
      width: '100%',
      height: '90%'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.actualizaListadoMensajes();
    });
  }
}
