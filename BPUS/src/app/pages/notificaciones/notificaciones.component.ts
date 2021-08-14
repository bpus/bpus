import { Component} from '@angular/core';
import Swal from 'sweetalert2';
import { NotificacionesService } from 'src/app/services/service.index';
import { Notificacion } from 'src/app/models/notificacion.model';
import {interval} from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html'
})

export class NotificacionesComponent {
  
  pipe = new DatePipe('en-US');
  meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  notificacionesLeidas: Notificacion[] = [];
  notificacionesNoLeidas: Notificacion[] = [];
  numeroNotificacionesLeidas: number = 0;
  numeroNotificacionesNoLeidas: number = 0;
  usuario = JSON.parse(localStorage.getItem('user'));


  constructor(private _notificacionService: NotificacionesService) {}

   ngOnInit() {
    //init_plugins()
    this.cargarNotificaciones();
    const contador = interval(1000*60*5);
    contador.subscribe((n) => {
      this.notificacionesLeidas = [];
      this.notificacionesNoLeidas = [];
      this.cargarNotificaciones();
    });
  }

  activeTab(tab: string) {
    const activeTab = document.getElementById(tab);
    const recibidasTab = document.getElementById('recibidasTab');
    const enviadasTab = document.getElementById('enviadasTab');
    recibidasTab.setAttribute('class', 'nav-link text-body');
    enviadasTab.setAttribute('class', 'nav-link text-body');
    activeTab.setAttribute('class', 'nav-link activeTab font-weight-bold');
  }

  cargarNotificaciones() {
    this.notificacionesLeidas = [];
    this.notificacionesNoLeidas = [];
    this._notificacionService.getNotificaciones(this.usuario._id).subscribe((resp:any) => {
      for (let i = 0; i < resp.notificaciones.length; i++) {
        let currentDate = new Date().getTime();
        let notiFecha = new Date(Date.parse(resp.notificaciones[i].fecha));
        let notiTime = new Date(Date.parse(resp.notificaciones[i].fecha)).getTime();
        let diff = currentDate - notiTime;
        let difminutos = Math.floor(diff/(1000*60));
        if(difminutos < 5){
          resp.notificaciones[i].fecha = "Hace un momento";
        }else if(difminutos >= 5 && difminutos < 60){
          resp.notificaciones[i].fecha = "Hace "+difminutos+" minutos";
        }else{
          let difhoras = Math.floor(diff/(1000*60*60));
          if(difhoras == 1){
            resp.notificaciones[i].fecha = "Hace "+difhoras+" hora";
          }else if(difhoras > 1 && difhoras < 24){
            resp.notificaciones[i].fecha = "Hace "+difhoras+" horas";
          }else{
            let difdias = Math.floor(diff/(1000*60*60*24));
            if(difdias == 1){
              resp.notificaciones[i].fecha = "Hace "+difdias+" día";
            }else if(difdias > 1 && difdias < 7){
              resp.notificaciones[i].fecha = "Hace "+difdias+" días";
            }else{
              resp.notificaciones[i].fecha = notiFecha.getDate()+" de "+this.meses[notiFecha.getMonth()]+" a las "+this.pipe.transform(notiFecha, 'shortTime');;
            }
          }
        }
        if(resp.notificaciones[i].isRead){
          this.notificacionesLeidas.push(resp.notificaciones[i]);
        }else{
          this.notificacionesNoLeidas.push(resp.notificaciones[i]);
        }
      }
      this.numeroNotificacionesLeidas = this.notificacionesLeidas.length;
      this.numeroNotificacionesNoLeidas = this.notificacionesNoLeidas.length;
    });
  }

  marcarLeida(id:string){
    Swal.fire({
      title:"Marcar como leida",
      icon: "question",
      showCancelButton: true,
      showConfirmButton:true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33',
      showCloseButton:false,
    }).then((result) => {
      if(result.value){
        this._notificacionService.isReadTrue(id).subscribe((resp:any)=>{
          if(resp){
            this.cargarNotificaciones();
          }
        });
      }
    });
  }

  
  marcarLeidaTodas(){
    Swal.fire({
      title:"Marcar todas las notificaciones como leidas",
      icon: "question",
      showCancelButton: true,
      showConfirmButton:true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33',
      showCloseButton:false,
    }).then((result) => {
      if(result.value){
        this._notificacionService.isReadTodasTrue(this.usuario._id).subscribe((resp:any)=>{
          if(resp){
            this.cargarNotificaciones();
          }
        });
      }
    });
  }

  borrarTodasNotificacion(){
    Swal.fire({
      title: '¿Está seguro que deseas borrar todas las notificaciones?',
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Borrar!',
      cancelButtonText: 'No, cancelar!'
    }).then(borrar => {
    if (borrar.value) {
      this._notificacionService.eliminarTodasNotificacion(this.usuario._id).subscribe(resp=>{           
        this.cargarNotificaciones();
      });
    } 
    });   
  }

  borrarNotificacion(notificacion:Notificacion){
    Swal.fire({
      title: '¿Está seguro que deseas borrar la notificación?',
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Borrar!',
      cancelButtonText: 'No, cancelar!'
    }).then(borrar => {
    if (borrar.value) {
      this._notificacionService.eliminarNotificacion(notificacion._id).subscribe(resp=>{           
        this.cargarNotificaciones();
      });
    } 
    });   
  }
  
}


