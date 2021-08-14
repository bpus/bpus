import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { VacantesService, PasantiService, NotificacionesService,ProgramaService, LineaInvestigacionService } from 'src/app/services/service.index';
import { Pasantia } from 'src/app/models/Pasantia';
import { Notificacion } from 'src/app/models/notificacion.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inscripcion-pasantia',
  templateUrl: './inscripcion-pasantia.component.html'
})
export class InscripcionPasantiaComponent implements OnInit {

  info = JSON.parse(localStorage.getItem('user'));
  vacantes: any[];
  lineas:any;
  programa:string;
  vacanteSelected:any;
  jefeProgramaID:string;
  empresa: string;
  lineaInvestigacion:string = "";
  personaCargo: any;
  correo: string;

  preInscripcion: any;
  nombreEmpresa: string;

  constructor(private _vacantesService: VacantesService, 
              private _pasantiaService: PasantiService,
              private _notificacionService: NotificacionesService,
              private _programaService: ProgramaService,
              private _lineasService: LineaInvestigacionService,
              private router: Router) { }

  ngOnInit(): void {
    let porcentajeAprobado = parseInt(localStorage.getItem("porcentajeAprobado")) || 0;
    if( porcentajeAprobado < 90){
      this.router.navigate(["/modalidades"]);
    }else{
      this.getVacantes();
      this.getJefePrograma();
      this.getLineas();
    }
  }

  getJefePrograma() {
    this._programaService.getPrograma().subscribe((resp) => {
      let infoPrograma = resp['programa'];
      this.programa = infoPrograma.nombre;
      this.jefeProgramaID = infoPrograma.jefe._id;
    });
  }

  getLineas(){
    this._lineasService.getlineasEstudiante(this.info.programa).subscribe((resp)=>{
      this.lineas = resp;
    });
  }

  getVacantes() {
    this._vacantesService.getVacantesEstudiante(this.info.programa).subscribe((resp: any) => {
      this.vacantes = resp.vacantes;
    });
  }

  postSolicitud(form: NgForm) {
    let idEstudiante = this.info._id;
    Swal.fire({
      title: '¿Hacer Pre-Incripición?',
      text: `Usted realizaría la pasantía en la empresa:  ${this.nombreEmpresa}`,
      icon: 'warning',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si',

      showCancelButton: true,
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33'

    }).then((result) => {
      if (result.value) {
        let preInscripcion = new Pasantia(
          null,
          this.preInscripcion,
          form.value.eps,
          this.lineaInvestigacion
        )
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
            this._pasantiaService.postSolicitud(idEstudiante, preInscripcion).subscribe(async (respP:any) => {
              let currentDate = new Date();
              let notificacion = new Notificacion(
                this.personaCargo._id,
                currentDate,
                'Nueva solicitd de pasantia',
                `${this.info.nombres} te ha enviado una solicitud de pasantía`,
                'Administrativo',
                this.personaCargo.correo 
              );
              b.textContent = "Enviando notificación al encargado de la empresa";
              await this._notificacionService.sendNotificacionCorreo(notificacion).toPromise();
              await this._notificacionService.postNotificacion(notificacion).toPromise();
              Swal.close();
              Swal.fire({
                title: '¡Bien Hecho!',
                html: 'Su solicitud fue enviada exitosamente',
                icon: 'success',
                showConfirmButton: false,
                showCancelButton: false,
                allowEscapeKey:false,
                allowEnterKey: false,
                allowOutsideClick: false,
                timer: 1300,
                timerProgressBar: false,
              }).then(() => {
                localStorage.setItem("reload", "true");
                this.router.navigate(['/']);
              });
            });
          }
        });
      }
    })
  }

  getDataInfo(data: any) {
    this.vacanteSelected = data;
    this.empresa = data.convenio.empresa.nombre;
    this.personaCargo = data.convenio.encargado;
    this.correo = data.convenio.encargado.correo;
  }

  getVacanteSelected(dato: any) {
    const lineaInvestigacion = (document.getElementById("lineaInvestigacion") as HTMLSelectElement).value;
    this.lineaInvestigacion = lineaInvestigacion;
    this.preInscripcion = dato._id;
    this.empresa = dato.convenio.empresa._id;
    this.nombreEmpresa = dato.convenio.empresa.nombre;
  }

}
