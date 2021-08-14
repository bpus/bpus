import { Component, OnInit } from '@angular/core';
import { PasantiService, ProyectoService } from 'src/app/services/service.index';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  user = JSON.parse(localStorage.getItem('user'));
  menu:any;
  menuEstudiante:boolean = false;
  pasantia:any;
  proyecto:any;
  diff:any

  // Inyectamos el _sidebarService para leer el menu
  constructor(private _pasantiaService: PasantiService, private _proyectoService: ProyectoService) { }

  ngOnInit(): void {
    if (this.user.codigo) {
      this.menuEstudiante = true;
      if (this.user.modalidad) {
        if(this.user.onModel === "Pasantia"){
          this._pasantiaService.getPasantia(this.user.modalidad).subscribe((resp: any) => {
            this.pasantia = resp.pasantia;
            if(this.pasantia.fecha_actaInicio){
              let currentDate = new Date();
              let fechaInicio = new Date(Date.parse(this.pasantia.fecha_actaInicio));
              this.diff = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate()) ) /(1000 * 60 * 60 * 24 * 7));
            }
          });
        }else if(this.user.onModel === "Proyecto"){
          this._proyectoService.getProyecto(this.user.modalidad).subscribe((resp:any)=>{
            this.proyecto = resp.proyecto;
          });
        }
      }
    }else{
      this.menu = JSON.parse(localStorage.getItem('menu'));
    }
  }

}
