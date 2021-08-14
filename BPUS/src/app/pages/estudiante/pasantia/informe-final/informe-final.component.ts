import { Component, OnInit } from '@angular/core';
import { PasantiService, NotificacionesService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';
import { Notificacion } from 'src/app/models/notificacion.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-informe-final',
  templateUrl: './informe-final.component.html'
})
export class InformeFinalComponent implements OnInit {

  documento_informeFinal = new FormData();
  nombreArchivoInforme: string;

  documento_aprobacionEmpresa = new FormData();
  nombreArchivoEmpresa: string;

  info = JSON.parse(localStorage.getItem('user'));
  pasantia:any;

  MAX_SIZE_FILE: number = 1000000;

  constructor(private _pasantiaService: PasantiService, 
    private _notificacionService: NotificacionesService, private router: Router) { }

  ngOnInit(): void { this.getPasantia();}

  getPasantia() {
    this._pasantiaService.getPasantia(this.info.modalidad).subscribe((resp: any) => {
      this.pasantia = resp.pasantia;
      if(!this.pasantia){
        this.router.navigate(["/login"]);
      }
    })
  }

  getFileInforme(file: File) {
    this.documento_informeFinal = new FormData();
    if (file.size > this.MAX_SIZE_FILE) {
      Swal.fire({
        title: '¡Lo Sentimos!',
        html: `<p> El archivo: <b>${file.name}</b>, supera las 1 MB</p>`,
        icon: 'error',
        confirmButtonText: 'Ok',
        showCancelButton: false,
        confirmButtonColor: '#60D89C',
      }).then(() => {
        this.nombreArchivoInforme = undefined;
      });

    } else {
      const nombreCortado = file.name.split('.');
      const extensionArchivo = nombreCortado[nombreCortado.length - 1];
      const extensionesValidas = ['pdf', 'PDF'];
  
      if (extensionesValidas.indexOf(extensionArchivo) >= 0) {
        this.nombreArchivoInforme = file.name;
        let documento_informeFinal = <File>file;
        this.documento_informeFinal.append('documento_informeFinal', documento_informeFinal, documento_informeFinal.name);
      }else{
        this.documento_informeFinal = new FormData();
        Swal.fire({
          title: '¡Lo Sentimos!',
          html: `<p> El archivo deber ser en formato pdf</p>`,
          icon: 'error',
          confirmButtonText: 'Ok',
          showCancelButton: false,
          confirmButtonColor: '#60D89C',
        }).then(() => {
          this.nombreArchivoInforme = undefined;
        });
      }
    }
  }

  getFileEmpresa(file: File) {

    if (file.size > this.MAX_SIZE_FILE) {
      this.documento_aprobacionEmpresa = new FormData();
      Swal.fire({
        title: '¡Lo Sentimos!',
        html: `<p> El archivo: <b>${file.name}</b>, supera las 1 MB</p>`,
        icon: 'error',
        confirmButtonText: 'Ok',
        showCancelButton: false,
        confirmButtonColor: '#60D89C',
      }).then(() => {
        this.nombreArchivoEmpresa = undefined;
      });

    } else {
      const nombreCortado = file.name.split('.');
      const extensionArchivo = nombreCortado[nombreCortado.length - 1];
      const extensionesValidas = ['pdf', 'PDF'];
  
      if (extensionesValidas.indexOf(extensionArchivo) >= 0) {
        this.nombreArchivoEmpresa = file.name;
        let documento_aprobacionEmpresa = <File>file;
        this.documento_aprobacionEmpresa.append('documento_aprobacionEmpresa', documento_aprobacionEmpresa, documento_aprobacionEmpresa.name);
      }else{
        this.documento_aprobacionEmpresa = new FormData();
        Swal.fire({
          title: '¡Lo Sentimos!',
          html: `<p> El archivo deber ser en formato pdf</p>`,
          icon: 'error',
          confirmButtonText: 'Ok',
          showCancelButton: false,
          confirmButtonColor: '#60D89C',
        }).then(() => {
          this.nombreArchivoEmpresa = undefined;
        });
      }
    }
  }


  enviarInforme() {

    Swal.fire({
      title: '¿Enviar Informe?',
      html: `<p> Se enviaran los documentos a su director</p>`,
      icon: 'warning',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si',

      showCancelButton: true,
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33'

    }).then((result) => {
      if (result.value) {
        let idEstudiante = this.info._id;
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
            b.textContent = "Subiendo informe final";
            this._pasantiaService.postDocumentoInfFinal(idEstudiante, this.documento_informeFinal).subscribe((resp:any)=>{
              if(resp){
                b.textContent = "Subiendo documento de aprobación de la empresa";
                this._pasantiaService.postDocumentoAprobacionEmpresa(idEstudiante,this.documento_aprobacionEmpresa).subscribe(async(respp:any)=>{
                  if(respp){
                    let currentDate = new Date();
                    let notificacion = new Notificacion(
                      this.pasantia.tutor._id,
                      currentDate,
                      'Envio de informe final',
                      `${this.info.nombres} ${this.info.apellidos} te ha enviado el informe final y el certificado de aprobación de la empresa`,
                      'Administrativo',
                      this.pasantia.tutor.correo 
                    );
                    b.textContent = "Enviando notificación al director";
                    await this._notificacionService.postNotificacion(notificacion).toPromise();
                    await this._notificacionService.sendArchivosJurado(this.info._id, notificacion).toPromise();
                    Swal.fire({
                      title: '¡Bien Hecho!',
                      text: `Se ha enviado correctamente el documento`,
                      icon: 'success',
                      showCloseButton: false,
                      showConfirmButton: false,
                      showCancelButton: false,
                      allowEnterKey: false,
                      allowOutsideClick:false,
                      allowEscapeKey: false,
                      timer: 1000,
                      timerProgressBar: false
                    }).then(() => {
                      localStorage.setItem("reload", "true");
                      this.router.navigate(["/"]);
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  }

  enviarInformeSus() {

    Swal.fire({
      title: '¿Enviar Informe?',
      icon: 'warning',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si',
      showCancelButton: true,
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.value) {
        let idEstudiante = this.info._id;
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
            b.textContent = "Subiendo informe final";
            this._pasantiaService.postDocumentoInfFinal(idEstudiante, this.documento_informeFinal).subscribe(async(resp:any)=>{
              if(resp){
                if(this.pasantia.evaluacion_jurado1 === "Ajustar"){
                  let notificacion = new Notificacion(
                    this.pasantia.jurado1._id,
                    new Date(),
                    'Envio de informe final',
                    `${this.info.nombres} ${this.info.apellidos} te ha enviado el informe final corregido`,
                    'Administrativo',
                    this.pasantia.jurado1.correo 
                  );
                  b.textContent = "Enviando notificación al jurado: "+this.pasantia.jurado1.nombres+" "+this.pasantia.jurado1.apellidos;
                  await this._notificacionService.postNotificacion(notificacion).toPromise();
                  await this._notificacionService.sendInformeFinalCorreo(this.info._id, notificacion).toPromise();
                }if(this.pasantia.evaluacion_jurado2 === "Ajustar"){
                  let notificacion = new Notificacion(
                    this.pasantia.jurado2._id,
                    new Date(),
                    'Envio de informe final',
                    `${this.info.nombres} ${this.info.apellidos} te ha enviado el informe final corregido`,
                    'Administrativo',
                    this.pasantia.jurado2.correo
                  );
                  b.textContent = "Enviando notificación al jurado: "+this.pasantia.jurado2.nombres+" "+this.pasantia.jurado2.apellidos;
                  await this._notificacionService.postNotificacion(notificacion).toPromise();
                  await this._notificacionService.sendInformeFinalCorreo(this.info._id, notificacion).toPromise();
                }
                Swal.fire({
                  title: '¡Bien Hecho!',
                  text: `Se ha enviado correctamente el documento`,
                  icon: 'success',
                  showCloseButton: false,
                  showConfirmButton: false,
                  showCancelButton: false,
                  allowEnterKey: false,
                  allowOutsideClick:false,
                  allowEscapeKey: false,
                  timer: 1000,
                  timerProgressBar: false
                }).then(() => {
                  localStorage.setItem("reload", "true");
                  this.router.navigate(["/"]);
                });
              }
            });
          }
        });
      }
    });
  }

}
