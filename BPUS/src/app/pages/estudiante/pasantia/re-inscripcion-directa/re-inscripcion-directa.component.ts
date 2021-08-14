import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Pasantia } from 'src/app/models/Pasantia';
import { PasantiService, LineaInvestigacionService, ConvenioService, NotificacionesService, ProgramaService } from 'src/app/services/service.index';
import { Notificacion } from 'src/app/models/notificacion.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-re-inscripcion-directa',
  templateUrl: './re-inscripcion-directa.component.html'
})
export class ReInscripcionDirectaComponent implements OnInit {

  pasantia: any;
  nombreArchivoP: string;
  nombreArchivoF: string;
  info = JSON.parse(localStorage.getItem('user'));
  lineas:any;
  nombreEmpresa:string;
  jefe:string;
  convenios: any;
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
    this.getPasantia()
    this.getEmpresas();
    this.getJefePrograma();
    this.getLineas();
  }

  getPasantia() {
    this._pasantiaService.getPasantia(this.info.modalidad).subscribe((resp: any) => {
      this.pasantia = resp.pasantia;
      if(!this.pasantia){
        this.router.navigate(["/login"]);
      }else{
        if(this.pasantia.estado !== 'Ajustar' && this.pasantia.aprobacionEmpresa !== false){
          this.router.navigate(['/']);
        }
      }
    });
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
    Swal.fire({
      title: '¿Hacer re-inscripición?',
      icon: 'warning',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si',
      showCancelButton: true,
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.value) {
        let reInscripcion = {convenio: this.idConvenio,
                            lineaInvestigacion: this.lineaInvestigacion,
                            titulo: this.tituloPasantia,
                            descripcion: this.descripcion}
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
            this._pasantiaService.putReInscripcion(this.pasantia._id, reInscripcion).subscribe((respP:any) => {
              let currentDate = new Date();
              let notificacion = new Notificacion(
                this.jefe,
                currentDate,
                'Nueva solicitd de pasantia',
                `${this.info.nombres} te ha enviado una solicitud de pasantia para la empresa ${this.nombreEmpresa}`,
                'Administrativo',
                this.info.correo);
              b.textContent = "Subiendo documento de la propuesta";
              this._pasantiaService.postDocumentoPropuesta(this.info._id, this.documento_propuesta).subscribe((resp:any) => {
                b.textContent = "Subiendo ficha academica";
                this._pasantiaService.postDocumentoFichaAcademica(this.info._id, this.documento_fichaAcademica).subscribe(async(resp:any) => {
                  b.textContent = "Enviando notificación al jefe de programa";
                  await this._notificacionService.postNotificacion(notificacion).toPromise();
                  await this._notificacionService.sendPropuestaCorreo(this.info._id, notificacion).toPromise();
                  Swal.close();
                  Swal.fire({
                    title: '¡Bien Hecho!',
                    html: `Su solicitud fue eviada exitosamente`,
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
    this.tituloPasantia = tituloPasantia.value;
    this.descripcion = descripcion.value;
    descripcion.style.overflow = 'hidden';
    descripcion.style.height = descripcion.getAttribute('data-min.rows');
    descripcion.style.height = descripcion.scrollHeight + 'px';
  }

  cleardata(){
    this.nombreArchivoP = undefined;
    this.nombreArchivoF= undefined;
    this.nombreEmpresa = undefined;
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
