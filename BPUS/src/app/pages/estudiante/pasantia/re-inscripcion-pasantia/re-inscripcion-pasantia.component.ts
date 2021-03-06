import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { VacantesService, PasantiService, NotificacionesService,ProgramaService, LineaInvestigacionService } from 'src/app/services/service.index';
import { Pasantia } from 'src/app/models/Pasantia';
import { Notificacion } from 'src/app/models/notificacion.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-re-inscripcion-pasantia',
  templateUrl: './re-inscripcion-pasantia.component.html'
})
export class ReInscripcionPasantiaComponent implements OnInit {

  info = JSON.parse(localStorage.getItem('user'));
  pasantia:any;
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
    this.getPasantia();
    this.getVacantes();
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
    Swal.fire({
      title: '??Hacer re-Incripici??n?',
      text: `Usted realizar??a la pasant??a en la empresa: ${this.nombreEmpresa}`,
      icon: 'warning',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si',
      showCancelButton: true,
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33'

    }).then((result) => {
      if (result.value) {
        let reInscripcion = {vacante: this.preInscripcion, lineaInvestigacion: this.lineaInvestigacion}
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
            this._pasantiaService.putReInscripcion(this.pasantia._id, reInscripcion).subscribe(async (respP:any) => {
              let currentDate = new Date();
              let notificacion = new Notificacion(
                this.personaCargo._id,
                currentDate,
                'Nueva solicitd de pasantia',
                `${this.info.nombres} te ha enviado una solicitud de vacante`,
                'Administrativo',
                this.personaCargo.correo 
              );
              b.textContent = "Enviando notificaci??n al encargado de la empresa";
              await this._notificacionService.sendNotificacionCorreo(notificacion).toPromise();
              await this._notificacionService.postNotificacion(notificacion).toPromise();
              Swal.close();
              Swal.fire({
                title: '??Bien Hecho!',
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
