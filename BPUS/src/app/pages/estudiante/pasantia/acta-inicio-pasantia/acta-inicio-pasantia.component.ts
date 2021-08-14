import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { PasantiService, NotificacionesService, ProgramaService } from 'src/app/services/service.index';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Notificacion } from 'src/app/models/notificacion.model';

@Component({
  selector: 'app-acta-inicio-pasantia',
  templateUrl: './acta-inicio-pasantia.component.html'
})

export class ActaInicioPasantiaComponent implements OnInit {

  pasantia: any;
  info = JSON.parse(localStorage.getItem('user'));
  programa:string;

  nombreArchivoARL: string;
  nombreArchivoActIni: string;
  nombreArchivoPropuesta: string;

  documento_ARL = new FormData();
  fecha_arl:string;
  fecha_arlToShow: string;
  fecha_ActToShow: string;
  documento_ActInicio = new FormData();
  fecha_artInicio:string;
  documento_actpropuesta = new FormData();

  MAX_SIZE_FILE: number = 1000000

  constructor(
    private _pasantiaService: PasantiService, 
    private _programaService: ProgramaService,
    private _notificacionService: NotificacionesService,
    private router: Router) { }

  ngOnInit(): void {
    if(this.info.modalidad !== null){
      this.getPasantia();
      this.getPrograma();
    }else{
      this.router.navigate(['/login']);
    }
  }

  getPrograma(){
    this._programaService.getPrograma().subscribe((resp) => {
      let infoPrograma = resp['programa'];
      this.programa = infoPrograma.nombre;
    });
  }

  getPasantia() {
    this._pasantiaService.getPasantia(this.info.modalidad).subscribe((resp: any) => {
      this.pasantia = resp.pasantia;
      if(this.pasantia){
        const pipe = new DatePipe('en-US');
        const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        if(this.pasantia.fecha_arl !== null && typeof(this.pasantia.fecha_arl) !== 'undefined'){
          this.fecha_arl = pipe.transform(this.pasantia.fecha_arl, 'yyyy-MM-dd');
          let fechaArl = new Date(Date.parse(this.pasantia.fecha_arl));
          this.fecha_arlToShow = pipe.transform(this.pasantia.fecha_arl, 'dd')+" de "+meses[fechaArl.getMonth()]+" del "+fechaArl.getFullYear();
        }
        if(this.pasantia.fecha_actaInicio !== null && typeof(this.pasantia.fecha_actaInicio) !== 'undefined'){
          let fechaInicio = new Date(Date.parse(this.pasantia.fecha_actaInicio));
          this.fecha_ActToShow = pipe.transform(this.pasantia.fecha_actaInicio, 'dd')+" de "+meses[fechaInicio.getMonth()]+" del "+fechaInicio.getFullYear();
        }
      }else{
        this.router.navigate(['/login']);
      }
    });
  }

  getFileARL(file: File) {
    if (file.size > this.MAX_SIZE_FILE) {
      this.documento_ARL = new FormData();
      Swal.fire({
        title: '¡Lo Sentimos!',
        html: `<p> El archivo: <b>${file.name}</b>, supera el 1 MB</p>`,
        icon: 'error',
        confirmButtonText: 'Ok',
        showCancelButton: false,
        confirmButtonColor: '#60D89C',
      }).then(() => {
        this.nombreArchivoARL = undefined;
      });

    } else {
      const nombreCortado = file.name.split('.');
      const extensionArchivo = nombreCortado[nombreCortado.length - 1];
      const extensionesValidas = ['pdf', 'PDF'];
  
      if (extensionesValidas.indexOf(extensionArchivo) >= 0) {
        this.nombreArchivoARL = file.name;
        let documento_ARL = <File>file;
        this.documento_ARL.append('documento_arl', documento_ARL, documento_ARL.name);
      }else{
        this.documento_ARL = new FormData();
        Swal.fire({
          title: '¡Lo Sentimos!',
          html: `<p> El archivo deber ser en formato pdf</p>`,
          icon: 'error',
          confirmButtonText: 'Ok',
          showCancelButton: false,
          confirmButtonColor: '#60D89C',
        }).then(() => {
          this.nombreArchivoARL = undefined;
        });
      }
    }
  }

  getFechaARL(){
    var fechaarl = (document.getElementById('fechaARL')) as HTMLInputElement;
    this.fecha_arl = fechaarl.value;
  }

  uploadARL(){
    this._pasantiaService.postDocumentoARL(this.info._id, this.documento_ARL, this.fecha_arl).subscribe((resp:any)=>{
      if(resp){
        Swal.fire({
          title: '¡Bien hecho!',
          html: `<p> Se ha enviado correctamente el documento.</p>`,
          icon: 'success',
          allowEnterKey: false,
          allowEscapeKey:false,
          allowOutsideClick:false,
          showCancelButton: false,
          showConfirmButton:false,
          showCloseButton:false,
          timer: 1000,
          timerProgressBar:false
        }).then(() => {
          this.getPasantia();
        });
      }
    });
  }
  
  getFechaActInicio(){
    var fechactInicio = (document.getElementById('fechaARL')) as HTMLInputElement;
    this.fecha_artInicio = fechactInicio.value;
  }

  uploadActInicio(){
    Swal.fire({
      title: 'Por favor espera!',
      html: '<b></b>',
      allowEnterKey: false,
      allowEscapeKey:false,
      allowOutsideClick:false,
      showCancelButton: false,
      showConfirmButton:false,
      showCloseButton:false,
      timer: 60000,
      timerProgressBar:false,
      onOpen:()=>{
        Swal.showLoading();
        const content = Swal.getHtmlContainer();
        const b = content.querySelector('b');
        b.textContent = "Subiendo acta de inicio";
        this._pasantiaService.postDocumentoActInicio(this.info._id, this.documento_ActInicio, this.fecha_artInicio).subscribe(async(resp:any)=>{
          if(resp){
            let currentDate = new Date();
            let notificacionT = new Notificacion(
              this.pasantia.tutor._id,
              currentDate,
              'Acta de inicio enviada',
              `El estudiante ${this.info.nombres} ${this.info.apellidos} ha subido el acta de inicio de su pasantia`,
              'Administrativo',
              this.pasantia.tutor.correo);
            if(this.pasantia.estado_actaInicio && this.pasantia.estado_actaInicio === "Ajustar"){
              notificacionT.mensaje = "Acta de inicio actualizada";
              notificacionT.mensajeDetalle = `El estudiante ${this.info.nombres} ${this.info.apellidos} ha actualizado el acta de inicio de su pasantia`;
            }
            b.textContent = "Enviando notificación al director";
            await this._notificacionService.postNotificacion(notificacionT).toPromise();
            await this._notificacionService.sendActInicioCorreo(this.info._id, notificacionT).toPromise();
            Swal.close();
            Swal.fire({
              title: '¡Bien hecho!',
              html: `<p> Se ha enviado correctamente el documento.</p>`,
              icon: 'success',
              allowEnterKey: false,
              allowEscapeKey:false,
              allowOutsideClick:false,
              showCancelButton: false,
              showConfirmButton:false,
              showCloseButton:false,
              timer: 1000,
              timerProgressBar:false
            }).then(() => {
              this.getPasantia();
            });
          }
        });
      }
    });
  }

  getFileActInicio(file: File) {
    if (file.size > this.MAX_SIZE_FILE) {
      this.documento_ActInicio = new FormData();
      Swal.fire({
        title: '¡Lo Sentimos!',
        html: `<p> El archivo: <b>${file.name}</b>, supera el 1 MB</p>`,
        icon: 'error',
        confirmButtonText: 'Ok',
        showCancelButton: false,
        confirmButtonColor: '#60D89C',
      }).then(() => {
        this.nombreArchivoActIni = undefined;
      });

    } else {
      const nombreCortado = file.name.split('.');
      const extensionArchivo = nombreCortado[nombreCortado.length - 1];
      const extensionesValidas = ['pdf', 'PDF'];
  
      if (extensionesValidas.indexOf(extensionArchivo) >= 0) {
        this.nombreArchivoActIni = file.name;
        let documento_ActInicio = <File>file;
        this.documento_ActInicio.append('documento_actaInicio', documento_ActInicio, documento_ActInicio.name);
      }else{
        this.documento_ActInicio = new FormData();
        Swal.fire({
          title: '¡Lo Sentimos!',
          html: `<p> El archivo deber ser en formato pdf</p>`,
          icon: 'error',
          confirmButtonText: 'Ok',
          showCancelButton: false,
          confirmButtonColor: '#60D89C',
        }).then(() => {
          this.nombreArchivoARL = undefined;
        });
      }
    }
  }

  getFilePropuesta(file: File) {
    if (file.size > this.MAX_SIZE_FILE) {
      this.documento_actpropuesta = new FormData();
      Swal.fire({
        title: '¡Lo Sentimos!',
        html: `<p> El archivo: <b>${file.name}</b>, supera el 1 MB</p>`,
        icon: 'error',
        confirmButtonText: 'Ok',
        showCancelButton: false,
        confirmButtonColor: '#60D89C',
      }).then(() => {
        this.nombreArchivoPropuesta = undefined;
      });

    } else {
      const nombreCortado = file.name.split('.');
      const extensionArchivo = nombreCortado[nombreCortado.length - 1];
      const extensionesValidas = ['pdf', 'PDF'];
  
      if (extensionesValidas.indexOf(extensionArchivo) >= 0) {
        this.nombreArchivoPropuesta = file.name;
        let documento_actpropuesta= <File>file;
        this.documento_actpropuesta.append('documento_actpropuesta', documento_actpropuesta, documento_actpropuesta.name);
      }else{
        this.documento_actpropuesta = new FormData();
        Swal.fire({
          title: '¡Lo Sentimos!',
          html: `<p> El archivo deber ser en formato pdf</p>`,
          icon: 'error',
          confirmButtonText: 'Ok',
          showCancelButton: false,
          confirmButtonColor: '#60D89C',
        }).then(() => {
          this.nombreArchivoPropuesta = undefined;
        });
      }
    }
  }

  uploadPropuesta(){
    Swal.fire({
      title: 'Por favor espera!',
      html: '<b></b>',
      allowEnterKey: false,
      allowEscapeKey:false,
      allowOutsideClick:false,
      showCancelButton: false,
      showConfirmButton:false,
      showCloseButton:false,
      timer: 60000,
      timerProgressBar:false,
      onOpen:()=>{
        Swal.showLoading();
        const content = Swal.getHtmlContainer();
        const b = content.querySelector('b');
        b.textContent = "Subiendo documento de la propuesta";
        this._pasantiaService.putDocumentoPropuesta(this.info._id, this.documento_actpropuesta).subscribe(async(resp:any)=>{
          if(resp){
            let currentDate = new Date();
            let notificacionT = new Notificacion(
              this.pasantia.tutor._id,
              currentDate,
              'Propuesta Actualizada',
              `El estudiante ${this.info.nombres} ${this.info.apellidos} ha actualizado la propuesta de su pasantia, se adjunta el documento.`,
              'Administrativo',
              this.pasantia.tutor.correo);
            b.textContent = "Enviando notificación al director";
            await this._notificacionService.postNotificacion(notificacionT).toPromise();
            await this._notificacionService.sendPropuestaCorreo(this.info._id, notificacionT).toPromise();
            Swal.fire({
              title: '¡Bien hecho!',
              html: `<p> Se ha enviado correctamente el documento.</p>`,
              icon: 'success',
              allowEnterKey: false,
              allowEscapeKey:false,
              allowOutsideClick:false,
              showCancelButton: false,
              showConfirmButton:false,
              showCloseButton:false,
              timer: 1000,
              timerProgressBar:false
            }).then(() => {
              this.getPasantia();
            });
          }
        });
      }
    });
  }

}
