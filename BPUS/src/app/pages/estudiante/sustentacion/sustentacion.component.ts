import { Component, OnInit } from '@angular/core';
import { PasantiService, ProyectoService } from 'src/app/services/service.index';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sustentacion',
  templateUrl: './sustentacion.component.html',
  styleUrls: ['./sustentacion.component.css']
})
export class SustentacionComponent implements OnInit {

  info = JSON.parse(localStorage.getItem('user'));
  pipe = new DatePipe('en-US');
  meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  modalidad: any;

  constructor(private _pasantiaService: PasantiService, private _proyectoService: ProyectoService, private router: Router) { }

  ngOnInit(): void {
    if(this.info.onModel === "Pasantia"){
      this.getPasantia();
    }else{
      this.getProyecto();
    }
  }

  getPasantia() {
    this._pasantiaService.getPasantia(this.info.modalidad).subscribe((resp: any) => {
      this.modalidad = resp.pasantia;
      if(this.modalidad.estado !== "Sustentación"){
        this.router.navigate(["/"]);
      }else{
        if(this.modalidad.sustentacion_fecha){
          let currentDate = new Date().getTime();
          let sustentacion_fecha = new Date(Date.parse(this.modalidad.sustentacion_fecha));
          this.modalidad.sustentacion_fecha = sustentacion_fecha.getDate()+" de "+this.meses[sustentacion_fecha.getMonth()];
          this.modalidad.hora = this.pipe.transform(sustentacion_fecha, 'shortTime');
          if(currentDate >= sustentacion_fecha.getTime()){
            this.modalidad.evaluacion = true;
          }else{
            this.modalidad.evaluacion = false;
          }
        }
      }
    });
  }

  getProyecto(){
    this._proyectoService.getProyecto(this.info.modalidad).subscribe((resp:any)=>{
      this.modalidad = resp.proyecto;
      if(this.modalidad.estado !== "Sustentación"){
        this.router.navigate(["/"]);
      }else{
        if(this.modalidad.sustentacion_fecha){
          let currentDate = new Date().getTime();
          let sustentacion_fecha = new Date(Date.parse(this.modalidad.sustentacion_fecha));
          this.modalidad.sustentacion_fecha = sustentacion_fecha.getDate()+" de "+this.meses[sustentacion_fecha.getMonth()];
          this.modalidad.hora = this.pipe.transform(sustentacion_fecha, 'shortTime');
          if(currentDate >= sustentacion_fecha.getTime()){
            this.modalidad.evaluacion = true;
          }else{
            this.modalidad.evaluacion = false;
          }
        }
      }
    });
  }

}
