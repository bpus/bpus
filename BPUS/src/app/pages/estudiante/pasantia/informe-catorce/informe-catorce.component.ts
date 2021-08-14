import { Component, OnInit } from '@angular/core';
import { PasantiService, NotificacionesService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';
import { Notificacion } from 'src/app/models/notificacion.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-informe-catorce',
  templateUrl: './informe-catorce.component.html'
})
export class InformeCatorceComponent implements OnInit {

  nombreArchivoInforme: string;
  info = JSON.parse(localStorage.getItem('user'));
  pasantia:any;
  documento_informe14 = new FormData();

  MAX_SIZE_FILE: number = 1000000;

  constructor(private _pasantiaService: PasantiService, private _notificacionService: NotificacionesService, private router: Router) { }

  ngOnInit(): void {this.getPasantia();}

  getPasantia() {
    this._pasantiaService.getPasantia(this.info.modalidad).subscribe((resp: any) => {
      this.pasantia = resp.pasantia;
      if(!this.pasantia){
        this.router.navigate(["/login"]);
      }
    })
  }

  getFileInforme(file: File) {
    if (file.size > this.MAX_SIZE_FILE) {
      this.documento_informe14 = new FormData();
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
        let documento_informe14 = <File>file;
        this.documento_informe14.append('documento_informe14', documento_informe14, documento_informe14.name);
      }else{
        this.documento_informe14 = new FormData();
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


  enviarInforme() {
    Swal.fire({
      title: '¿Enviar Informe?',
      html: `<p> Se enviará el documento a su tutor asignado</p>`,
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
            b.textContent = "Subiendo informe de la semana 14";
            this._pasantiaService.postDocumentoInf14(idEstudiante, this.documento_informe14).subscribe(async(resp:any)=>{
              if(resp){
                let currentDate = new Date();
                let notificacion = new Notificacion(
                  this.pasantia.tutor._id,
                  currentDate,
                  'Envio de informe 14',
                  `${this.info.nombres} ${this.info.apellidos} te ha enviado el informe de la semana 14`,
                  'Administrativo',
                  this.pasantia.tutor.correo
                );
                b.textContent = "Enviando notificación al director";
                await this._notificacionService.postNotificacion(notificacion).toPromise();
                await this._notificacionService.sendInforme14Correo(this.info._id, notificacion).toPromise();
                Swal.close();
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
