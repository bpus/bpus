import { Component, OnInit } from '@angular/core';
import { PasantiService, NotificacionesService, ConvenioService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';
import { Notificacion } from 'src/app/models/notificacion.model';

@Component({
  selector: 'app-mod-solicitud-vacante',
  templateUrl: './solicitud-vacante.component.html'
})
export class EncarSolicitudVacanteComponent implements OnInit {

  info: any;
  solicitudes: any[];
  pasantiaSelected: any;

  constructor(private _pasantiaService: PasantiService, 
              private _notificacionService: NotificacionesService) { }

  ngOnInit(): void {
    this.info = JSON.parse(localStorage.getItem('user'));
    this.getSolicitudes();
  }

  getSolicitudes() {
    this._pasantiaService.getSolicitudesEncargado().subscribe((resp: any) => {
      this.solicitudes = resp.pasantias;
      this.pasantiaSelected = this.solicitudes[0];
    });
  }

  aprobarSolicitud() {
    Swal.fire({
      title: 'Estas seguro?',
      text: 'Vas a aprobar la vacante de '+ this.pasantiaSelected.estudiante.nombres,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aprobar!',
      cancelButtonText: 'Cerrar'
    }).then((result) => {
      if (result.value) {
        let currentDate = new Date();
        let notificacion = new Notificacion(
          this.pasantiaSelected.estudiante._id,
          currentDate,
          'Solicitud de vacante aprobada',
          `Te han aprobado tu solicitud de vancante para la empresa ${this.pasantiaSelected.vacante.convenio.empresa.nombre}`,
          'Estudiante',
          this.pasantiaSelected.estudiante.correo 
        );
        this._pasantiaService.cambiarEstadoEncargado(this.pasantiaSelected._id, true).subscribe((resp:any) => {
          if(resp){
            this._notificacionService.postNotificacion(notificacion).subscribe();
            this._notificacionService.sendNotificacionCorreo(notificacion).subscribe();                     
            Swal.close();
            Swal.fire({
              title: 'Aprobada correctamente',
              icon: 'success',
              timer: 2000,
              showConfirmButton:false,
              timerProgressBar: true,
            }).then(() => {
                this.getSolicitudes();
            });
          }
        });
      }
    });
  }

  rechazarSolicitud(){
    Swal.fire({
      title: 'Estas seguro?',
      text: 'Vas a rechazar la vacante de '+ this.pasantiaSelected.estudiante.nombres,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Rechazar!',
      cancelButtonText: 'Cerrar'
    }).then((result) => {
      if (result.value) {
        let currentDate = new Date();
        let notificacion = new Notificacion(
          this.pasantiaSelected.estudiante._id,
          currentDate,
          'Solicitud de vacante rechazada',
          `Te han rechazado tu solicitud de vancante en ${this.pasantiaSelected.vacante.convenio.empresa.nombre}`,
          'Estudiante',
          this.pasantiaSelected.estudiante.correo  
        );
        this._pasantiaService.cambiarEstadoEncargado(this.pasantiaSelected._id, false).subscribe((resp:any) => {
          if(resp){
            this._notificacionService.postNotificacion(notificacion).subscribe((respN:any)=> {
              if(respN){
                this._notificacionService.sendNotificacionCorreo(notificacion).subscribe((respC:any)=>{
                  if(respC){
                    Swal.close();
                    Swal.fire({
                      title: 'Rechazada correctamente',
                      icon: 'success',
                      timer: 2000,
                      showConfirmButton:false,
                      timerProgressBar: true,
                    }).then(() => {
                      this.getSolicitudes();
                    });
                  }  
                });
              }
            });    
          }
        });
      }
    })
  }

  getDataInfo(data: any) {
    this.pasantiaSelected = data;
  }

  getDataBuscar(data) {

  }

}
