import { Component, OnInit } from '@angular/core';
import { PasantiService, ProyectoService } from 'src/app/services/service.index';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mi-solicitud',
  templateUrl: './mi-solicitud.component.html'
})
export class MiSolicitudComponent implements OnInit {

  info = JSON.parse(localStorage.getItem('user'));
  pasantia: any;
  proyecto:any;
  fechaInicio:string;
  semanas:any;

  constructor(private _pasantiaService: PasantiService, private _proyectoService:ProyectoService,private router: Router) { }

  ngOnInit(): void {
    if(this.info.modalidad !== null){
      if(this.info.onModel === "Pasantia"){
        this.getPasantia();
      }else if(this.info.onModel === "Proyecto"){
        this.getProyecto();
      }
    }else{
      this.router.navigate(['/modalidades'])
    }
  }

  activeTab(tab: string) {
    const activeTab = document.getElementById(tab);
    const problemaTab = document.getElementById('problemaTab');
    const alcanceTab = document.getElementById('alcanceTab');
    const metodologiaTab = document.getElementById('metodologiaTab');
    problemaTab.setAttribute('class', 'nav-link text-body');
    alcanceTab.setAttribute('class', 'nav-link text-body');
    metodologiaTab.setAttribute('class', 'nav-link text-body');
    activeTab.setAttribute('class', 'nav-link activeTab font-weight-bold');
  }

  getPasantia() {
    this._pasantiaService.getPasantia(this.info.modalidad).subscribe((resp: any) => {
      this.pasantia = resp.pasantia;
      const pipe = new DatePipe('en-US');
      let currentDate = new Date();
      if(this.pasantia.fecha_actaInicio){
        let fechaInicio = new Date(Date.parse(this.pasantia.fecha_actaInicio));
        let diff = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate()) ) /(1000 * 60 * 60 * 24 * 7));
        let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        this.fechaInicio = pipe.transform(fechaInicio, 'dd')+" de "+meses[fechaInicio.getMonth()]+" del "+fechaInicio.getFullYear(); 
        if(Math.floor(diff) === 0){
          this.semanas = 1;
        }else if(Math.floor(diff) > 0 && Math.floor(diff) <= 24){
          this.semanas = Math.floor(diff);
        }else{
          this.semanas = 24;
        }
      }
    });
  }

  getProyecto() {
    this._proyectoService.getProyecto(this.info.modalidad).subscribe((resp: any) => {
      this.proyecto = resp.proyecto;
      const pipe = new DatePipe('en-US');
      let currentDate = new Date();
      if(this.proyecto.fecha_aprobacion){
        let fechaInicio = new Date(Date.parse(this.proyecto.fecha_aprobacion));
        let diff = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate()) ) /(1000 * 60 * 60 * 24 * 7));
        let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        this.fechaInicio = pipe.transform(fechaInicio, 'dd')+" de "+meses[fechaInicio.getMonth()]+" del "+fechaInicio.getFullYear(); 
        if(Math.floor(diff) === 0){
          this.semanas = 1;
        }else if(Math.floor(diff) > 0 && Math.floor(diff) <= 52){
          this.semanas = Math.floor(diff);
        }else{
          this.semanas = 52;
        }
      }
    });
  }

}
