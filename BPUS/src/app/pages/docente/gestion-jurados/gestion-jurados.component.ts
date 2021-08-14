import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { PasantiService, ProyectoService, AdministrativoService, NotificacionesService } from 'src/app/services/service.index';
import { Notificacion } from 'src/app/models/notificacion.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-gestion-jurados',
  templateUrl: './gestion-jurados.component.html'
})
export class GestionJuradosComponent implements OnInit {

  user = JSON.parse(localStorage.getItem('user'));
  pipe = new DatePipe('en-US');
  fechamin:string;
  fechamax:string;

  pasantias: any[];
  pasantiaSelected: any;
 
  proyectos: any[];
  proyectoSelected:any;
  
  jurados: any
  juradoPasantia1:string = "";
  juradoPasantia2:string = "";
  juradoProyecto1:string = "";
  juradoProyecto2:string = "";

  constructor(private _pasantiaService: PasantiService,
    private _proyectoService: ProyectoService,
    private _tutoresService: AdministrativoService,
    private _notificacionService: NotificacionesService) { }

  ngOnInit(): void {
    const fecha =  new Date();
    let max = fecha.getTime()+(1000*60*60*24*33);
    let min = fecha.getTime()+(1000*60*60*24*3);
    let fechamax = new Date(max);
    let fechamin = new Date(min)
    this.fechamin = this.pipe.transform(fechamin, 'yyyy-MM-dd');
    this.fechamax = this.pipe.transform(fechamax, 'yyyy-MM-dd');
    this.getPasantias();
    this.getJurados();
    this.getProyectos();
  }

  activeTab(tab: string) {
    const activeTab = document.getElementById(tab);
    const pasantiaTab = document.getElementById('pasantiaTab');
    const proyectoTab = document.getElementById('proyectoTab');
    pasantiaTab.setAttribute('class', 'nav-link text-body');
    proyectoTab.setAttribute('class', 'nav-link text-body');
    activeTab.setAttribute('class', 'nav-link activeTab font-weight-bold');
  }

  getProyectos() {
    this._proyectoService.getProyectosAsignarJurados(this.user.programa).subscribe((resp: any) => {
      this.proyectos = resp.proyectos;
    });
  }

  getPasantias() {
    this._pasantiaService.getSolicitudesAsignarJurado(this.user.programa).subscribe((resp: any) => {
      this.pasantias = resp.pasantias;
      let currentDate = new Date();
      let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
      for (let i = 0; i < this.pasantias.length; i++) {
        if(this.pasantias[i].fecha_actaInicio){
          let fechaInicio = new Date(Date.parse(this.pasantias[i].fecha_actaInicio));
          this.pasantias[i].fecha_actaInicio =  fechaInicio.getDate()+" de "+meses[fechaInicio.getMonth()]+" del "+fechaInicio.getFullYear();
          let diff = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate()) ) /(1000 * 60 * 60 * 24 * 7));
          if(Math.floor(diff) === 0){
            this.pasantias[i].semanas = 1;
          }else if(Math.floor(diff) > 0 && Math.floor(diff) <= 24){
            this.pasantias[i].semanas = Math.floor(diff);
          }else{
            this.pasantias[i].semanas = 24;
          }
        }
      }
    })
  }

  checkJuradosPasantia(){
    let errorJuradosPasantia = (document.getElementById('errorJuradosPasantia')) as HTMLElement;
    if(this.juradoPasantia1 !== "" && this.juradoPasantia2 !== "" && this.juradoPasantia1 === this.juradoPasantia2){
      errorJuradosPasantia.setAttribute('style','display:block; color: red;');
    }else{
      errorJuradosPasantia.setAttribute('style','display:none;');
    }
  }

  checkJuradosProyecto(){
    let errorJuradosProyecto = (document.getElementById('errorJuradosProyecto')) as HTMLElement;
    if(this.juradoProyecto1 !== "" && this.juradoProyecto2 !== "" && this.juradoProyecto1 === this.juradoProyecto2){
      errorJuradosProyecto.setAttribute('style','display:block; color: red;');
    }else{
      errorJuradosProyecto.setAttribute('style','display:none;');
    }
  }

  AsignarJuradosPasantia(idPasantia:string, f:NgForm){
    Swal.fire({
      title: '¿Asignar jurados?',
      icon: 'warning',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si',
      showCancelButton: true,
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.value) {
        
        let fechaArray = f.value.fecha.split(/\D/);
        let horaArray = f.value.hora.split(/\D/);
        let sustentacion_fecha =  new Date(fechaArray[0], --fechaArray[1], fechaArray[2], horaArray[0], horaArray[1]);
        let hora = this.pipe.transform(sustentacion_fecha, 'shortTime')
        let pasantia = {
          jurado1: this.juradoPasantia1,
          jurado2:this.juradoPasantia2,
          fecha: f.value.fecha,
          hora: f.value.hora,
          lugar: f.value.lugar
        };
        let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        let jurado1Nombre:string; let jurado2Nombre:string;

        let selectJurado1 = (document.getElementById("juradoPasantia1")) as HTMLSelectElement;
        let selectJurado2 = (document.getElementById("juradoPasantia2")) as HTMLSelectElement;
        let selectedIndex1 = selectJurado1.selectedIndex; let selectedIndex2 = selectJurado2.selectedIndex;  
        selectedIndex1 = selectedIndex1-1; selectedIndex2 = selectedIndex2-1;

        jurado1Nombre = this.jurados[selectedIndex1].nombres+' '+this.jurados[selectedIndex1].apellidos;
        jurado2Nombre = this.jurados[selectedIndex2].nombres+' '+this.jurados[selectedIndex2].apellidos;

        Swal.fire({
          title: 'Por favor espera!',
          html: '<b></b>',
          allowEnterKey: false,
          allowEscapeKey: false,
          allowOutsideClick: false,
          showCancelButton: false,
          showCloseButton: false,
          showConfirmButton:false,
          timer: 1000*60*5,
          timerProgressBar: false,
          onOpen: () => {
            Swal.showLoading();
            const content = Swal.getHtmlContainer();
            const b = content.querySelector('b');
            b.textContent = "Asignando jurados de la pasantia";

            this._pasantiaService.asignarJurado(idPasantia, pasantia).subscribe(async(resp:any) => {
              const currentDate = new Date();

              let notificacionE =new Notificacion(
                this.pasantiaSelected.estudiante._id,
                currentDate,
                'Te han asignado los jurados de tu pasantia',
                `${jurado1Nombre} y ${jurado2Nombre} serán los jurados de tu pasantia, se realizara en ${f.value.lugar} el ${sustentacion_fecha.getDate()} de ${meses[sustentacion_fecha.getMonth()]} a las ${hora}`,
                'Estudiante',
                this.pasantiaSelected.estudiante.correo);

              let notificacionJ1 =new Notificacion(
                this.juradoPasantia1,
                currentDate,
                'Te han asignado como jurado de una pasantia',
                `Has sido asignado como jurado de la pasantia del estudiante ${this.pasantiaSelected.estudiante.nombres} ${this.pasantiaSelected.estudiante.apellidos}`,
                'Administrativo',
                this.jurados[selectedIndex1].correo);
                
              let notificacionJ2 =new Notificacion(
                this.juradoPasantia2,
                currentDate,
                'Te han asignado como jurado de una pasantia',
                `Has sido asignado como jurado de la pasantia del estudiante ${this.pasantiaSelected.estudiante.nombres} ${this.pasantiaSelected.estudiante.apellidos}`,
                'Administrativo',
                this.jurados[selectedIndex2].correo);
              b.textContent = "Asignando notificacion al estudiante";
              await this._notificacionService.postNotificacion(notificacionE).toPromise();
              await this._notificacionService.sendNotificacionCorreo(notificacionE).toPromise();
              b.textContent = "Enviando notificacion al jurado: "+jurado1Nombre;
              await this._notificacionService.postNotificacion(notificacionJ1).toPromise();
              await this._notificacionService.sendArchivosJurado(this.pasantiaSelected.estudiante._id, notificacionJ1).toPromise();
              b.textContent = "Enviando notificacion al jurado: "+jurado2Nombre;
              await this._notificacionService.postNotificacion(notificacionJ2).toPromise();
              await this._notificacionService.sendArchivosJurado(this.pasantiaSelected.estudiante._id, notificacionJ2).toPromise();
              Swal.close();
              Swal.fire({
                title: '¡Bien hecho!',
                text: 'Jurados asignados correctamente',
                icon: 'success',
                allowEnterKey: false,
                allowEscapeKey: false,
                allowOutsideClick: false,
                showCancelButton: false,
                showCloseButton: false,
                showConfirmButton:false,
                timer: 1200,
                timerProgressBar: false
              }).then(() => {
                const btnCerrar = (document.getElementById('btnCerrar')) as HTMLElement;
                btnCerrar.click();
                this.getPasantias();
              });
            });
          }
        });
      }
    });
  }

  AsignarJuradosProyecto(f:NgForm){
    Swal.fire({
      title: '¿Asignar jurados?',
      icon: 'warning',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si',
      showCancelButton: true,
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.value) {
        Swal.close();
        Swal.fire({
          title: 'Por favor espera!',
          html: '<b></b>',
          allowEnterKey: false,
          allowEscapeKey: false,
          allowOutsideClick: false,
          showCancelButton: false,
          showCloseButton: false,
          showConfirmButton:false,
          timer: 1000*60*5,
          timerProgressBar: false,
          onOpen: () => {
            Swal.showLoading();
            const content = Swal.getHtmlContainer();
            const b = content.querySelector('b');
            b.textContent = "Asignando jurados al proyecto";
            let fechaArray = f.value.fecha.split(/\D/);
            let horaArray = f.value.hora.split(/\D/);
            let sustentacion_fecha =  new Date(fechaArray[0], --fechaArray[1], fechaArray[2], horaArray[0], horaArray[1]);
            let hora = this.pipe.transform(sustentacion_fecha, 'shortTime')
            let proyecto = {
              jurado1: this.juradoProyecto1,
              jurado2:this.juradoProyecto2,
              fecha: f.value.fecha,
              hora: f.value.hora,
              lugar: f.value.lugar
            };
            let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
            let jurado1Nombre:string; let jurado2Nombre:string;

            let selectJurado1 = (document.getElementById("juradoProyecto1")) as HTMLSelectElement;
            let selectJurado2 = (document.getElementById("juradoProyecto2")) as HTMLSelectElement;
            let selectedIndex1 = selectJurado1.selectedIndex; let selectedIndex2 = selectJurado2.selectedIndex;  
            selectedIndex1 = selectedIndex1-1; selectedIndex2 = selectedIndex2-1;

            jurado1Nombre = this.jurados[selectedIndex1].nombres+' '+this.jurados[selectedIndex1].apellidos;
            jurado2Nombre = this.jurados[selectedIndex2].nombres+' '+this.jurados[selectedIndex2].apellidos;

            this._proyectoService.asignarJurados(this.proyectoSelected._id, proyecto).subscribe(async(resp:any) => {
              const currentDate = new Date();
              let notificacionE =new Notificacion(
                this.proyectoSelected.estudiante._id,
                currentDate,
                'Te han asignado los jurados de tu proyecto',
                `${jurado1Nombre} y ${jurado2Nombre} serán los jurados de tu proyecto, se realizara en ${f.value.lugar} el ${sustentacion_fecha.getDate()} de ${meses[sustentacion_fecha.getMonth()]} a las ${hora}`,
                'Estudiante',
                this.proyectoSelected.estudiante.correo);
                b.textContent = "Enviando notificación a "+this.proyectoSelected.estudiante.nombres;
                await this._notificacionService.postNotificacion(notificacionE).toPromise();
                await this._notificacionService.sendNotificacionCorreo(notificacionE).toPromise();
                if(this.proyectoSelected.estudiante2){
                  notificacionE.receptor = this.proyectoSelected.estudiante2._id;
                  notificacionE.receptorCorreo = this.proyectoSelected.estudiante2.correo;
                  b.textContent = "Enviando notificación a "+this.proyectoSelected.estudiante2.nombres;
                  await this._notificacionService.postNotificacion(notificacionE).toPromise();
                  await this._notificacionService.sendNotificacionCorreo(notificacionE).toPromise();
                }
                if(this.proyectoSelected.estudiante3){
                  notificacionE.receptor = this.proyectoSelected.estudiante3._id;
                  notificacionE.receptorCorreo = this.proyectoSelected.estudiante3.correo;
                  b.textContent = "Enviando notificación a "+this.proyectoSelected.estudiante3.nombres;
                  await this._notificacionService.postNotificacion(notificacionE).toPromise();
                  await this._notificacionService.sendNotificacionCorreo(notificacionE).toPromise();
                }
              let notificacionJ1 =new Notificacion(
                this.juradoProyecto1,
                currentDate,
                'Te han asignado como jurado de un proyecto',
                `Has sido asignado como jurado del proyecto: ${this.proyectoSelected.titulo}`,
                'Administrativo',
                this.jurados[selectedIndex1].correo);
              b.textContent = "Enviando notificación al jurado: "+jurado1Nombre;
              await this._notificacionService.postNotificacion(notificacionJ1).toPromise();
              await this._notificacionService.sendCorreoProyectoArchivo(this.proyectoSelected.documento_proyecto, this.proyectoSelected._id, notificacionJ1).toPromise();
              let notificacionJ2 =new Notificacion(
                this.juradoProyecto2,
                currentDate,
                'Te han asignado como jurado de un proyecto',
                `Has sido asignado como jurado del proyecto: ${this.proyectoSelected.titulo}`,
                'Administrativo',
                this.jurados[selectedIndex2].correo);
              b.textContent = "Enviando notificación al jurado: "+jurado2Nombre;
              await this._notificacionService.postNotificacion(notificacionJ2).toPromise();
              await this._notificacionService.sendCorreoProyectoArchivo(this.proyectoSelected.documento_proyecto, this.proyectoSelected._id, notificacionJ2).toPromise();
              Swal.close();
            });
          },
          onClose: () => {
            Swal.fire({
              title: '¡Bien Hecho!',
              html: "Jurados asignados correctamente",
              icon: 'success',
              allowEnterKey: false,
              allowEscapeKey: false,
              allowOutsideClick: false,
              showCancelButton: false,
              showCloseButton: false,
              showConfirmButton:false,
              timer: 1300,
              timerProgressBar: false
            }).then(() => {
              const btnCerrar = (document.getElementById('btnCerrarProyecto')) as HTMLElement;
              btnCerrar.click();
              this.getProyectos();
              this.juradoProyecto1 = "";
              this.juradoProyecto2 = "";
              this.proyectoSelected = undefined;
            });
          }
        }).then(() => {
          const btnCerrar = (document.getElementById('btnCerrarProyecto')) as HTMLElement;
          btnCerrar.click();
          this.getProyectos();
          this.juradoProyecto1 = "";
          this.juradoProyecto2 = "";
          this.proyectoSelected = undefined;
        });
      }
    });
  }

  getJurados() {
    let idPrograma = this.user.programa;
    this._tutoresService.getTutores(idPrograma).subscribe((resp: any) => {
      this.jurados = resp.admins;
    });
  }

  getPasantiaSelected(data: any) {
    this.pasantiaSelected = data;
  }

  getProyectoSelected(data: any) {
    this.proyectoSelected = data;
  }

  clearDataPasantia(){
    this.juradoPasantia1 = "";
    this.juradoPasantia2 = "";
    let errorJuradosPasantia = (document.getElementById('errorJuradosPasantia')) as HTMLElement;
    errorJuradosPasantia.setAttribute('style','display:none;');
  }

  clearDataProyecto(){
    this.juradoProyecto1 = "";
    this.juradoProyecto2 = "";
    let errorJuradosProyecto = (document.getElementById('errorJuradosProyecto')) as HTMLElement;
    errorJuradosProyecto.setAttribute('style','display:none;');
  }

}
