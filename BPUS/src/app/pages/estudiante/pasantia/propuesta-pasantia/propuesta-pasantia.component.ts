import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { PasantiService, NotificacionesService, ProgramaService } from 'src/app/services/service.index';
import { Notificacion } from 'src/app/models/notificacion.model';
import { Router } from '@angular/router';
import { Pasantia } from 'src/app/models/Pasantia';

@Component({
  selector: 'app-acta-inicio',
  templateUrl: './propuesta-pasantia.component.html'
})
export class PropuestaPasantiaComponent implements OnInit {

  pasantia: any;
  programa:string;
  nombreArchivoP: string;
  nombreArchivoF: string;
  info = JSON.parse(localStorage.getItem('user'));
  jefe:any;
  tituloPasantia:string;
  descripcion:string;

  documento_propuesta = new FormData();
  documento_fichaAcademica = new FormData();

  MAX_SIZE_FILE: number = 1000000;

  constructor(private _pasantiaService: PasantiService, 
              private _programaService: ProgramaService,
              private _notificacionService: NotificacionesService,
              private router: Router) { }

  ngOnInit(): void {
    if(this.info.modalidad !== null){
      this.getPasantia();
      this.getJefePrograma();
    }else{
      this.router.navigate(['/login']);
    }
  }

  getPasantia() {
    this._pasantiaService.getPasantia(this.info.modalidad).subscribe((resp: any) => {
      this.pasantia = resp.pasantia;
      if(!this.pasantia){
        this.router.navigate(['/login']);
      }
    })
  }

  getFilePropuesta(file: File) {

    if (file.size > this.MAX_SIZE_FILE) {
      this.documento_propuesta = new FormData();
      Swal.fire({
        title: '¡Lo Sentimos!',
        html: `<p> El archivo: <b>${file.name}</b>, supera el 1 MB</p>`,
        icon: 'error',
        confirmButtonText: 'Ok',
        showCancelButton: false,
        confirmButtonColor: '#60D89C',
      }).then(() => {
        this.nombreArchivoP = undefined;
      });

    } else {
      const nombreCortado = file.name.split('.');
      const extensionArchivo = nombreCortado[nombreCortado.length - 1];
      const extensionesValidas = ['pdf', 'PDF'];
  
      if (extensionesValidas.indexOf(extensionArchivo) >= 0) {
        this.nombreArchivoP = file.name;
        let documento_propuesta = <File>file;
        this.documento_propuesta.append('documento_propuesta', documento_propuesta, documento_propuesta.name);
      }else{
        this.documento_propuesta = new FormData();
        Swal.fire({
          title: '¡Lo Sentimos!',
          html: `<p> El archivo deber ser en formato pdf</p>`,
          icon: 'error',
          confirmButtonText: 'Ok',
          showCancelButton: false,
          confirmButtonColor: '#60D89C',
        }).then(() => {
          this.nombreArchivoP = undefined;
        });
      }
    }
  }

  getFileFicha(file: File) {

    if (file.size > this.MAX_SIZE_FILE) {
      this.documento_fichaAcademica = new FormData();
      Swal.fire({
        title: '¡Lo Sentimos!',
        html: `<p> El archivo: <b>${file.name}</b>, supera el 1 MB</p>`,
        icon: 'error',
        confirmButtonText: 'Ok',
        showCancelButton: false,
        confirmButtonColor: '#60D89C',
      }).then(() => {
        this.nombreArchivoF = undefined;
      });

    } else {
      const nombreCortado = file.name.split('.');
      const extensionArchivo = nombreCortado[nombreCortado.length - 1];
      const extensionesValidas = ['pdf', 'PDF'];
  
      if (extensionesValidas.indexOf(extensionArchivo) >= 0) {
        this.nombreArchivoF = file.name;
        let documento_fichaAcademica = <File>file;
        this.documento_fichaAcademica.append('documento_fichaAcademica', documento_fichaAcademica, documento_fichaAcademica.name);
      }else{
        this.documento_fichaAcademica = new FormData();
        Swal.fire({
          title: '¡Lo Sentimos!',
          html: `<p> El archivo deber ser en formato pdf</p>`,
          icon: 'error',
          confirmButtonText: 'Ok',
          showCancelButton: false,
          confirmButtonColor: '#60D89C',
        }).then(() => {
          this.nombreArchivoF = undefined;
        });
      }
    }
  }

  postSolicitud() {

    let idEstudiante = this.info._id;

    Swal.fire({
      title: '¿Hacer Inscripición?',
      icon: 'warning',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si',
      showCancelButton: true,
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33'

    }).then((result) => {
      if (result.value) {
        let pasantia = new Pasantia(null,null,null,null,this.tituloPasantia,this.descripcion);
        let currentDate = new Date();
        let notificacion = new Notificacion(
          this.jefe._id,
          currentDate,
          'Nueva solicitd de pasantia',
          `${this.info.nombres} te ha enviado una solicitud de pasantia para la empresa ${this.pasantia.vacante.convenio.empresa.nombre}, se adjunta el documento de la solicitud.`,
          'Administrativo',
          this.jefe.correo);
        
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
              b.textContent = "Agregando título y descripción a la pasantia";
              this._pasantiaService.putSolicitudPropuesta(this.pasantia._id, pasantia).subscribe((awns:any) =>{
                b.textContent = "Subiendo documento de la propuesta";
                this._pasantiaService.postDocumentoPropuesta(idEstudiante, this.documento_propuesta).subscribe((respDP:any) => {
                  b.textContent = "Subiendo ficha academica";
                  this._pasantiaService.postDocumentoFichaAcademica(idEstudiante, this.documento_fichaAcademica).subscribe(async(respDF:any) => {
                    b.textContent = "Enviando notificación al jefe de programa";
                    await this._notificacionService.postNotificacion(notificacion).toPromise();
                    await this._notificacionService.sendPropuestaCorreo(idEstudiante, notificacion).toPromise();
                    Swal.close();
                    Swal.fire({
                      title: '¡Bien Hecho!',
                      html: `Su solicitud fue eviada exitosamente, el radicado de su solicitud es: <b> ${respDF._id}</b>`,
                      icon: 'warning',
                      confirmButtonText: 'Aceptar',
                      confirmButtonColor: '#60D89C',
                      allowEnterKey: false,
                      allowEscapeKey:false,
                      allowOutsideClick:false
                    }).then(() => {
                      localStorage.setItem("reload", "true");
                      this.router.navigate(['/']);
                    });               
                  });
                });
              });
            }
          });
      }
    })
  }

  getInfoPropuesta(){

    var tituloPasantia = (document.getElementById("tituloPasantia")) as HTMLInputElement;
    var descripcion = (document.getElementById("descripcion")) as HTMLInputElement;

    this.tituloPasantia = tituloPasantia.value;
    this.descripcion = descripcion.value;
    descripcion.style.overflow = 'hidden';
    descripcion.style.height = descripcion.getAttribute('data-min.rows');
    descripcion.style.height = descripcion.scrollHeight + 'px';
  }

  cleardata(){
    this.nombreArchivoP = undefined;
    this.nombreArchivoF= undefined;
    this.tituloPasantia = undefined;
    this.descripcion = undefined;
  
    this.documento_propuesta = new FormData();
    this.documento_fichaAcademica = new FormData();
  }

  getJefePrograma() {
    this._programaService.getPrograma().subscribe((resp) => {
      let infoPrograma = resp['programa'];
      this.programa = infoPrograma.nombre;
      this.jefe = infoPrograma.jefe;
    });
  }

}
