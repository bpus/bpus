import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Pasantia } from 'src/app/models/Pasantia';
import { PasantiService, LineaInvestigacionService, ConvenioService, NotificacionesService, ProgramaService } from 'src/app/services/service.index';
import { Notificacion } from 'src/app/models/notificacion.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acta-inicio',
  templateUrl: './inscripcion-directa.component.html'
})
export class InscripcionDirectaComponent implements OnInit {

  pasantia: string;
  nombreArchivoP: string;
  nombreArchivoF: string;
  info = JSON.parse(localStorage.getItem('user'));
  lineas:any;
  nombreEmpresa:string;
  jefe:string;
  convenios: any;
  eps:string;
  tituloPasantia:string;
  descripcion:string;
  idConvenio:string;
  lineaInvestigacion:string;

  documento_propuesta = new FormData();
  documento_fichaAcademica = new FormData();

  MAX_SIZE_FILE: number = 1000000

  constructor(private _pasantiaService: PasantiService, 
              private _convenioService: ConvenioService,
              private _programaService: ProgramaService,
              private _notificacionService: NotificacionesService,
              private _lineasService: LineaInvestigacionService,
              private router: Router) { }

  ngOnInit(): void {
    let porcentajeAprobado = parseInt(localStorage.getItem("porcentajeAprobado")) || 0;
    if( porcentajeAprobado < 90){
      this.router.navigate(["/modalidades"]);
    }else{
      this.getEmpresas();
      this.getJefePrograma();
      this.getLineas();
    }
  }

  getLineas(){
    this._lineasService.getlineasEstudiante(this.info.programa).subscribe((resp)=>{
      this.lineas = resp;
    });
  }

  getEmpresas(){
    this._convenioService.getConveniosPrograma(this.info.programa).subscribe((resp:any) => {
      this.convenios = resp.convenios;
    });
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

        let inscripcion = new Pasantia(
          this.idConvenio,
          null,
          this.eps,
          this.lineaInvestigacion,
          this.tituloPasantia,
          this.descripcion
        );

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
            b.textContent = "Creando pasantia";
            this._pasantiaService.postSolicitudDirecta(idEstudiante, inscripcion).subscribe((respP:any) => {
              let currentDate = new Date();
              let notificacion = new Notificacion(
                this.jefe,
                currentDate,
                'Nueva solicitd de pasantia',
                `${this.info.nombres} te ha enviado una solicitud de pasantia para la empresa ${this.nombreEmpresa}`,
                'Administrativo',
                this.info.correo);
              b.textContent = "Subiendo documento de la propuesta";
              this._pasantiaService.postDocumentoPropuesta(idEstudiante, this.documento_propuesta).subscribe((resp:any) => {
                b.textContent = "Subiendo ficha academica";
                this._pasantiaService.postDocumentoFichaAcademica(idEstudiante, this.documento_fichaAcademica).subscribe(async(resp:any) => {
                  b.textContent = "Enviando notificación al jefe de programa";
                  await this._notificacionService.postNotificacion(notificacion).toPromise();
                  await this._notificacionService.sendPropuestaCorreo(idEstudiante, notificacion).toPromise();
                  Swal.close();
                  Swal.fire({
                    title: '¡Bien Hecho!',
                    html: `Su solicitud fue eviada exitosamente, el radicado de su solicitud es: <b> ${respP._id}</b>`,
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
    });
  }

  getInfoPropuesta(){
    let selectEmpresas = (document.getElementById("mySelect")) as HTMLSelectElement;
    const lineaInvestigacion = (document.getElementById("lineaInvestigacion") as HTMLSelectElement).value;
    let eps = (document.getElementById("eps")) as HTMLInputElement;
    let tituloPasantia = (document.getElementById("tituloPasantia")) as HTMLInputElement;
    let descripcion = (document.getElementById("descripcion")) as HTMLInputElement;
    let selectedIndex = selectEmpresas.selectedIndex;

    if(selectedIndex > 0){
      selectedIndex = selectedIndex-1;
      this.nombreEmpresa = this.convenios[selectedIndex].empresa.nombre;
      this.idConvenio =  this.convenios[selectedIndex]._id;
    }else{
      this.nombreEmpresa = '';
      this.idConvenio = '';
    }

    this.lineaInvestigacion = lineaInvestigacion;
    let epsSelected = eps.value;
    this.tituloPasantia = tituloPasantia.value;
    this.descripcion = descripcion.value;
    descripcion.style.overflow = 'hidden';
    descripcion.style.height = descripcion.getAttribute('data-min.rows');
    descripcion.style.height = descripcion.scrollHeight + 'px';
    this.eps = epsSelected;
  }

  cleardata(){
    this.nombreArchivoP = undefined;
    this.nombreArchivoF= undefined;
    this.nombreEmpresa = undefined;
    this.eps = undefined;
    this.tituloPasantia = undefined;
    this.descripcion = undefined;
    this.idConvenio = undefined;
  
    this.documento_propuesta = new FormData();
    this.documento_fichaAcademica = new FormData();
  }

  getJefePrograma() {
    this._programaService.getPrograma().subscribe((resp) => {
      let infoPrograma = resp['programa'];
      this.info.programa = infoPrograma.nombre;
      this.jefe = infoPrograma.jefe._id;
    });
  }

}
