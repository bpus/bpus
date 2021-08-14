import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { PasantiService, ProyectoService, NotificacionesService } from 'src/app/services/service.index';
import { Notificacion } from 'src/app/models/notificacion.model';
import { PasantiaEvaluar } from '../../../models/PasantiaEvaluar.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-jurado-pasantia',
  templateUrl: './jurado.component.html'
})
export class JuradoComponent implements OnInit {

  user:any;
  meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  pasantias:any;
  pasantiaSelected:any;

  proyectos:any;
  proyectoSelected:any;
  
  eva_jurado_pasantia:string = "";
  notas_jurado_pasantia = "";
  filePasantiaValid = false;

  eva_jurado_proyecto:string = "";
  notas_jurado_proyecto = "";
  fileProyectoValid = false;

  MAX_SIZE_FILE: number = 1000000;
  documento_evaluacion_pasantia = new FormData();
  documento_evaluacion_proyecto = new FormData();

  constructor(private _pasantiaService: PasantiService, 
    private _notificacionService: NotificacionesService,
    private _proyectoService: ProyectoService) { }

  ngOnInit(): void {
    this.user  = JSON.parse(localStorage.getItem('user'));
    this.getPasantias();
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
    this._proyectoService.getProyectosJurado(this.user._id).subscribe((resp: any) => {
      this.proyectos = resp.proyectos;
      const pipe = new DatePipe('en-US');
      const curretDate = new Date().getTime();
      for(let i = 0; i < this.proyectos.length; i++) {
        if(this.proyectos[i].sustentacion_fecha){
          let sustentacion_fecha = new Date(Date.parse(this.proyectos[i].sustentacion_fecha));
          this.proyectos[i].sustentacion_fecha = sustentacion_fecha.getDate()+" de "+this.meses[sustentacion_fecha.getMonth()]+" a las "+pipe.transform(sustentacion_fecha, 'shortTime');
          if(curretDate >= sustentacion_fecha.getTime()){
            this.proyectos[i].evaluar = true;
          }else{
            this.proyectos[i].evaluar = false;
          }
        }
      }
    });
  }

  getPasantias() {
    this._pasantiaService.getSolicitudesJurado(this.user._id).subscribe((resp: any) => {
      this.pasantias = resp.pasantias;
      let currentDate = new Date();
      const pipe = new DatePipe('en-US');
      for (let i = 0; i < this.pasantias.length; i++) {
        if(this.pasantias[i].fecha_actaInicio){
          let fechaInicio = new Date(Date.parse(this.pasantias[i].fecha_actaInicio));
          this.pasantias[i].fecha_actaInicio =  fechaInicio.getDate()+" de "+this.meses[fechaInicio.getMonth()]+" del "+fechaInicio.getFullYear();
          let diff = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate()) ) /(1000 * 60 * 60 * 24 * 7));
          if(Math.floor(diff) === 0){
            this.pasantias[i].semanas = 1;
          }else{
            this.pasantias[i].semanas = Math.floor(diff);
          }
        }if(this.pasantias[i].sustentacion_fecha){
          const curretDate = new Date().getTime();
          let sustentacion_fecha = new Date(Date.parse(this.pasantias[i].sustentacion_fecha));
          this.pasantias[i].sustentacion_fecha = sustentacion_fecha.getDate()+" de "+this.meses[sustentacion_fecha.getMonth()]+" a las "+pipe.transform(sustentacion_fecha, 'shortTime');
          if(curretDate >= sustentacion_fecha.getTime()){
            this.pasantias[i].evaluar = true;
          }else{
            this.pasantias[i].evaluar = true;
          }
        }
      }
    });
  }

  getFileEvaluacionPasantia(file: File) {
    const labelDocumentoPasantia = document.getElementById("labelDocumentoPasantia") as HTMLElement;
    if (file.size > this.MAX_SIZE_FILE) {
      this.filePasantiaValid = false;
      Swal.fire({
        title: '¡Lo Sentimos!',
        html: `<p> El archivo: <b>${file.name}</b>, supera las 1 MB</p>`,
        icon: 'error',
        confirmButtonText: 'Ok',
        showCancelButton: false,
        confirmButtonColor: '#60D89C',
      }).then(() => {
        labelDocumentoPasantia.innerHTML = "Click aquí para subir el documento de evaluación";
        this.documento_evaluacion_pasantia = new FormData();
      });
    } else {
      const nombreCortado = file.name.split('.');
      const extensionArchivo = nombreCortado[nombreCortado.length - 1];
      const extensionesValidas = ['pdf', 'PDF'];
  
      if (extensionesValidas.indexOf(extensionArchivo) >= 0) {
        this.filePasantiaValid = true;
        labelDocumentoPasantia.setAttribute("style", "color: #8F141B; font-weight: bold;");
        labelDocumentoPasantia.innerHTML = file.name;
        let documento_evaluacion_pasantia = <File>file;
        this.documento_evaluacion_pasantia.append('documento_evaluacion_pasantia', documento_evaluacion_pasantia, documento_evaluacion_pasantia.name);
      }else{
        this.documento_evaluacion_pasantia = new FormData();
        this.filePasantiaValid = false;
        Swal.fire({
          title: '¡Lo Sentimos!',
          html: `<p> El archivo deber ser en formato pdf</p>`,
          icon: 'error',
          confirmButtonText: 'Ok',
          showCancelButton: false,
          confirmButtonColor: '#60D89C',
        }).then(() => {
          labelDocumentoPasantia.setAttribute("style", "");
          labelDocumentoPasantia.innerHTML = "Click aquí para subir el documento de evaluación"
        });
      }
    }
  }

  getFileEvaluacionProyecto(file: File) {
    const labelDocumentoProyecto = document.getElementById("labelDocumentoProyecto") as HTMLElement;
    if (file.size > this.MAX_SIZE_FILE) {
      this.fileProyectoValid = false;
      Swal.fire({
        title: '¡Lo Sentimos!',
        html: `<p> El archivo: <b>${file.name}</b>, supera las 1 MB</p>`,
        icon: 'error',
        confirmButtonText: 'Ok',
        showCancelButton: false,
        confirmButtonColor: '#60D89C',
      }).then(() => {
        labelDocumentoProyecto.innerHTML = "Click aquí para subir el documento de evaluación";
        this.documento_evaluacion_proyecto = new FormData();
      });
    } else {
      const nombreCortado = file.name.split('.');
      const extensionArchivo = nombreCortado[nombreCortado.length - 1];
      const extensionesValidas = ['pdf', 'PDF'];
  
      if (extensionesValidas.indexOf(extensionArchivo) >= 0) {
        this.fileProyectoValid = true;
        labelDocumentoProyecto.setAttribute("style", "color: #8F141B; font-weight: bold;");
        labelDocumentoProyecto.innerHTML = file.name;
        let documento_evaluacion_proyecto = <File>file;
        this.documento_evaluacion_proyecto.append('documento_evaluacion_proyecto', documento_evaluacion_proyecto, documento_evaluacion_proyecto.name);
      }else{
        this.documento_evaluacion_proyecto = new FormData();
        this.fileProyectoValid = false;
        Swal.fire({
          title: '¡Lo Sentimos!',
          html: `<p> El archivo deber ser en formato pdf</p>`,
          icon: 'error',
          confirmButtonText: 'Ok',
          showCancelButton: false,
          confirmButtonColor: '#60D89C',
        }).then(() => {
          labelDocumentoProyecto.setAttribute("style", "");
          labelDocumentoProyecto.innerHTML = "Click aquí para subir el documento de evaluación"
        });
      }
    }
  }

  notasJuradoPasantia(){
    const notas_jurado_pasantia = (document.getElementById('notas_jurado_pasantia')) as HTMLElement;
    if(this.eva_jurado_pasantia === "Ajustar"){
      notas_jurado_pasantia.setAttribute('class','collapse show');
    }else{
      this.notas_jurado_pasantia = "";
      notas_jurado_pasantia.setAttribute('class','collapse');
    }
  }

  notasJuradoProyecto(){
    const notas_jurado_proyecto = (document.getElementById('notas_jurado_proyecto')) as HTMLElement;
    if(this.eva_jurado_proyecto === "Ajustar"){
      notas_jurado_proyecto.setAttribute('class','collapse show');
    }else{
      this.notas_jurado_pasantia = "";
      notas_jurado_proyecto.setAttribute('class','collapse');
    }
  }

  evaluarPasantia(){
    Swal.fire({
      html: `Evaluaras de la sustentación de la pasantia de ${this.pasantiaSelected.estudiante.nombres}`,
      icon: 'warning',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Enviar',
      showCancelButton: true,
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if(result.value){
        const pasantia = new PasantiaEvaluar(this.user._id, this.eva_jurado_pasantia, this.notas_jurado_pasantia);
        Swal.fire({
          title: 'Por favor espera!',
          html: '<b></b>',
          allowEnterKey: false,
          allowEscapeKey: false,
          allowOutsideClick: false,
          showCancelButton: false,
          showCloseButton: false,
          showConfirmButton:false,
          timer: 1000*60*2,
          timerProgressBar: false,
          onOpen: () => {
            Swal.showLoading();
            const content = Swal.getHtmlContainer();
            const b = content.querySelector('b');
            b.textContent = "Evaluando pasantia";
            this._pasantiaService.evaluar(this.pasantiaSelected._id, pasantia).subscribe((resp:any) => {
              b.textContent = "Subiendo documento de evaluación";
              this._pasantiaService.postDocumentoEvaluacion(this.pasantiaSelected.estudiante._id, this.user._id, this.documento_evaluacion_pasantia).subscribe(async(respp:any) => {
                const fecha = new Date();
                b.textContent = "Enviando notificación al estudiante";
                if(respp.estado == 'Aprobada'){
                  const notificacionA = new Notificacion(
                    this.pasantiaSelected.estudiante._id,
                    fecha,
                    '🎓 Pasantia completada ✅ ',
                    `Ambos jurados te han aprobado la sustentación, felicidades! 🎊`,
                    'Estudiante',
                    this.pasantiaSelected.estudiante.correo);
                  await this._notificacionService.postNotificacion(notificacionA).toPromise();
                  await this._notificacionService.sendNotificacionCorreo(notificacionA).toPromise();
                }else{
                  let txt= "Sustentación aprobada";
                  let txtDetalle =  `El jurado ${this.user.nombres} ${this.user.apellidos} te ha aprobado la sustentación`;
                  if(this.eva_jurado_pasantia === "Ajustar"){
                    txt = "Petición de ajuste de la pasantia";
                    txtDetalle =  `El jurado ${this.user.nombres} ${this.user.apellidos} te ha pedido un ajuste`;
                  }
                  const notificacion = new Notificacion(
                    this.pasantiaSelected.estudiante._id,
                    fecha,
                    txt,
                    txtDetalle,
                    'Estudiante',
                    this.pasantiaSelected.estudiante.correo);
                  await this._notificacionService.postNotificacion(notificacion).toPromise();
                  await this._notificacionService.sendEvaluacion(this.pasantiaSelected.estudiante._id, this.user._id, notificacion).toPromise();
                }
                Swal.close();
                Swal.fire({
                  title: '¡Bien hecho!',
                  text: 'Evaluación enviada correctamente',
                  icon: 'success',
                  allowEnterKey: false,
                  allowEscapeKey: false,
                  allowOutsideClick: false,
                  showCancelButton: false,
                  showCloseButton: false,
                  showConfirmButton:false,
                  timer: 1000,
                  timerProgressBar: false
                }).then(()=>{
                  const btnCerrar = (document.getElementById('btnCerrar')) as HTMLElement;
                  btnCerrar.click();
                  this.getPasantias();
                });
              });
            });
          }
        });
      }
    });
  }

  evaluarProyecto(){
    Swal.fire({
      title: `Evaluar la sustentación?!`,
      icon: 'warning',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Enviar',
      showCancelButton: true,
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if(result.value){
        const proyecto = new PasantiaEvaluar(this.user._id, this.eva_jurado_proyecto, this.notas_jurado_proyecto);
        Swal.fire({
          title: 'Por favor espera!',
          html: '<b></b>',
          allowEnterKey: false,
          allowEscapeKey: false,
          allowOutsideClick: false,
          showCancelButton: false,
          showCloseButton: false,
          showConfirmButton:false,
          timer: 1000*60*2,
          timerProgressBar: false,
          onOpen: () => {
            Swal.showLoading();
            const content = Swal.getHtmlContainer();
            const b = content.querySelector('b');
            b.textContent = "Evaluando proyecto";
            this._proyectoService.evaluar(this.proyectoSelected._id, proyecto).subscribe((resp:any) => {
              b.textContent = "Subiendo documento de evaluación";
              this._proyectoService.postDocumentoEvaluacion(this.proyectoSelected._id, this.user._id, this.documento_evaluacion_proyecto).subscribe(async(respp:any) => {
                const fecha = new Date();
                if(respp.estado == 'Aprobado'){
                  const notificacionA = new Notificacion(
                    this.proyectoSelected.estudiante._id,
                    fecha,
                    '🎓 Proyecto completado ✅ ',
                    `Ambos jurados te han aprobado la sustentación, felicidades! 🎊`,
                    'Estudiante',
                    this.proyectoSelected.estudiante.correo);
                  b.textContent = "Enviando notificación a "+this.proyectoSelected.estudiante.nombres;
                  await this._notificacionService.postNotificacion(notificacionA).toPromise();
                  await this._notificacionService.sendNotificacionCorreo(notificacionA).toPromise();
                  if(this.proyectoSelected.estudiante2){
                    notificacionA.receptor = this.proyectoSelected.estudiante2._id;
                    notificacionA.receptorCorreo = this.proyectoSelected.estudiante2.correo;
                    b.textContent = "Enviando notificación a "+this.proyectoSelected.estudiante2.nombres;
                    await this._notificacionService.postNotificacion(notificacionA).toPromise();
                    await this._notificacionService.sendNotificacionCorreo(notificacionA).toPromise();
                  }
                  if(this.proyectoSelected.estudiante3){
                    notificacionA.receptor = this.proyectoSelected.estudiante3._id;
                    notificacionA.receptorCorreo = this.proyectoSelected.estudiante3.correo;
                    b.textContent = "Enviando notificación a "+this.proyectoSelected.estudiante3.nombres;
                    await this._notificacionService.postNotificacion(notificacionA).toPromise();
                    await this._notificacionService.sendNotificacionCorreo(notificacionA).toPromise();
                  }
                }else{
                  let txt= "Sustentación aprobada";
                  let txtDetalle =  `El jurado ${this.user.nombres} ${this.user.apellidos} te ha aprobado la sustentación`;
                  if(this.eva_jurado_proyecto === "Ajustar"){
                    txt = "Petición de ajuste al proyecto";
                    txtDetalle =  `El jurado ${this.user.nombres} ${this.user.apellidos} te ha pedido un ajuste`;
                  }
                  const notiE = new Notificacion(
                    this.proyectoSelected.estudiante._id,
                    fecha,
                    txt,
                    txtDetalle,
                    'Estudiante',
                    this.proyectoSelected.estudiante.correo);
                    b.textContent = "Enviando notificación a "+this.proyectoSelected.estudiante.nombres;
                    await this._notificacionService.postNotificacion(notiE).toPromise();
                    await this._notificacionService.sendNotificacionCorreo(notiE).toPromise();
                    if(this.proyectoSelected.estudiante2){
                      notiE.receptor = this.proyectoSelected.estudiante2._id;
                      notiE.receptorCorreo = this.proyectoSelected.estudiante2.correo;
                      b.textContent = "Enviando notificación a "+this.proyectoSelected.estudiante2.nombres;
                      await this._notificacionService.postNotificacion(notiE).toPromise();
                      await this._notificacionService.sendNotificacionCorreo(notiE).toPromise();
                    }
                    if(this.proyectoSelected.estudiante3){
                      notiE.receptor = this.proyectoSelected.estudiante3._id;
                      notiE.receptorCorreo = this.proyectoSelected.estudiante3.correo;
                      b.textContent = "Enviando notificación a "+this.proyectoSelected.estudiante3.nombres;
                      await this._notificacionService.postNotificacion(notiE).toPromise();
                      await this._notificacionService.sendNotificacionCorreo(notiE).toPromise();
                    }
                }
                Swal.close();
                Swal.fire({
                  title: '¡Bien hecho!',
                  text: 'Evaluación enviada correctamente',
                  icon: 'success',
                  allowEnterKey: false,
                  allowEscapeKey: false,
                  allowOutsideClick: false,
                  showCancelButton: false,
                  showCloseButton: false,
                  showConfirmButton:false,
                  timer: 1000,
                  timerProgressBar: false
                }).then(()=>{
                  const btnCerrar = (document.getElementById('btnCerrarProyecto')) as HTMLElement;
                  btnCerrar.click();
                  this.getProyectos();
                });
              });
            });
          }
        });
      }
    });
  }

  clearDataPasantia(){
    this.documento_evaluacion_pasantia = new FormData();
    this.eva_jurado_pasantia = "";
    this.notas_jurado_pasantia = "";
    this.filePasantiaValid = false;
    const notas_jurado_pasantia = (document.getElementById('notas_jurado_pasantia')) as HTMLElement;
    notas_jurado_pasantia.setAttribute('class','collapse');
  }

  clearDataProyecto(){
    this.documento_evaluacion_proyecto = new FormData();
    this.eva_jurado_proyecto = "";
    this.notas_jurado_proyecto = "";
    this.fileProyectoValid = false;
    const notas_jurado_proyecto = (document.getElementById('notas_jurado_proyecto')) as HTMLElement;
    notas_jurado_proyecto.setAttribute('class','collapse');
  }

  getPasantiaSelected(data: any) {
    this.pasantiaSelected = data;
  }

  getProyectoSelected(data: any) {
    this.proyectoSelected = data;
  }

}
