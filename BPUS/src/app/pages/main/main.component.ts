import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: []
})
export class MainComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    if(localStorage.getItem("reload")){
      localStorage.removeItem("reload");
      location.reload();
    }
    this.showAlerts();
  }

  async showAlerts(){
    if(localStorage.getItem("ProyectoAlertA")){
      let txt:string;
      if(parseInt(localStorage.getItem("ProyectoAlertA")) === 7){
        txt = "La próxima semana deberias subir el anteproyecto, tenlo listo"
      }else{
        txt = `Ya han pasado ${localStorage.getItem("ProyectoAlertA")} semanas, deberias subir el anteproyecto!`;
      }
      await Swal.fire({
        html: "<b>"+txt+"</b>",
        icon: "info",
        showConfirmButton:true,
        showCancelButton: false,
        showCloseButton:false,
        confirmButtonText: "Aceptar",
        confirmButtonColor: '#60D89C'
      }).then(() => {
        localStorage.removeItem("ProyectoAlertA");
      });
    }
    if(localStorage.getItem("ProyectoAlertP")){
      let txt:string;
      if(parseInt(localStorage.getItem("ProyectoAlertP")) === 15){
        txt = "La próxima semana deberias subir el proyecto, tenlo listo"
      }else{
        txt = `Ya han pasado ${localStorage.getItem("ProyectoAlertP")} semanas, deberias subir el proyecto!`;
      }
      await Swal.fire({
        html: "<b>"+txt+"</b>",
        icon: "info",
        showConfirmButton:true,
        showCancelButton: false,
        showCloseButton:false,
        confirmButtonText: "Aceptar",
        confirmButtonColor: '#60D89C'
      }).then(() => {
        localStorage.removeItem("ProyectoAlertP");
      });
    }
    if(localStorage.getItem("PasantiaAlert7")){
      let txt:string;
      if(parseInt(localStorage.getItem("PasantiaAlert7")) === 6){
        txt = "La próxima semana deberas subir el informe de la semana 7, tenlo listo"
      }else{
        txt = `Ya han pasado ${localStorage.getItem("PasantiaAlert7")} semanas, deberias subir el informe de la semana 7!`;
      }
      await Swal.fire({
        html: "<b>"+txt+"</b>",
        icon: "info",
        showConfirmButton:true,
        showCancelButton: false,
        showCloseButton:false,
        confirmButtonText: "Aceptar",
        confirmButtonColor: '#60D89C'
      }).then(() => {
        localStorage.removeItem("PasantiaAlert7");
      });
    }
    if(localStorage.getItem("PasantiaAlert14")){
      let txt:string;
      if(parseInt(localStorage.getItem("PasantiaAlert14")) === 13){
        txt = "La próxima semana deberas subir el informe de la semana 14, tenlo listo"
      }else{
        txt = `Ya han pasado ${localStorage.getItem("PasantiaAlert14")} semanas, deberias subir el informe de la semana 14!`;
      }
      await Swal.fire({
        html: "<b>"+txt+"</b>",
        icon: "info",
        showConfirmButton:true,
        showCancelButton: false,
        showCloseButton:false,
        confirmButtonText: "Aceptar",
        confirmButtonColor: '#60D89C'
      }).then(() => {
        localStorage.removeItem("PasantiaAlert14");
      });
    }
    if(localStorage.getItem("PasantiaAlertFinal")){
      let txt:string;
      if(parseInt(localStorage.getItem("PasantiaAlertFinal")) === 13){
        txt = "La próxima semana deberas subir el informe final y el cetificado de aprobación de la empresa, tenlos listo"
      }else{
        txt = `Ya han pasado ${localStorage.getItem("PasantiaAlertFinal")} semanas, deberias subir el informe final y el cetificado de aprobación de la empresa!`;
      }
      await Swal.fire({
        html: "<b>"+txt+"</b>",
        icon: "info",
        showConfirmButton:true,
        showCancelButton: false,
        showCloseButton:false,
        confirmButtonText: "Aceptar",
        confirmButtonColor: '#60D89C'
      }).then(() => {
        localStorage.removeItem("PasantiaAlertFinal");
      });
    }
  }

}
