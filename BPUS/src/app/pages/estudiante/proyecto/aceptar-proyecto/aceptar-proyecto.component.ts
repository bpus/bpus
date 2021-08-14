import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ProyectoService, NotificacionesService, ProgramaService } from 'src/app/services/service.index';
import { Notificacion} from 'src/app/models/notificacion.model'
import { Router } from '@angular/router';

@Component({
  selector: 'app-aceptar-proyecto',
  templateUrl: './aceptar-proyecto.component.html',
  styleUrls: ['./aceptar-proyecto.component.css']
})
export class AceptarProyectoComponent implements OnInit {

  info = JSON.parse(localStorage.getItem("user"));
  proyecto = JSON.parse(localStorage.getItem("modalidad"));
  programa:any;
  jefe:any;
  fichaValid = false;
  documento_fichaAcademica = new FormData();
  MAX_SIZE_FILE: number = 1000000;

  constructor(private _proyectoService: ProyectoService, 
    private _notificacionService: NotificacionesService,
    private _programaService: ProgramaService,
    private router: Router)  { }

  ngOnInit(): void {
    this.getProgramaInfo();
  }

  getProgramaInfo() {
    this._programaService.getPrograma().subscribe((resp) => {
      let infoPrograma = resp['programa'];
      this.programa = infoPrograma;
      this.jefe = infoPrograma.jefe;
    });
  }

  getFileFicha(file: File) {
    const labelFicha = document.getElementById("labelFicha") as HTMLElement;
    if (file.size > this.MAX_SIZE_FILE) {
      this.documento_fichaAcademica = new FormData();
      this.fichaValid = false;
      Swal.fire({
        title: '¡Lo Sentimos!',
        html: `<p> El archivo: <b>${file.name}</b>, supera el 1 MB</p>`,
        icon: 'error',
        confirmButtonText: 'Ok',
        showCancelButton: false,
        confirmButtonColor: '#60D89C',
      }).then(() => {
        labelFicha.setAttribute("style", "");
        labelFicha.innerHTML = "Click para subir el archivo del anteproyecto"
      });
    } else {
      const nombreCortado = file.name.split('.');
      const extensionArchivo = nombreCortado[nombreCortado.length - 1];
      const extensionesValidas = ['pdf', 'PDF'];
  
      if (extensionesValidas.indexOf(extensionArchivo) >= 0) {
        this.fichaValid = true;
        labelFicha.setAttribute("style", "color: #8F141B; font-weight: bold;");
        labelFicha.innerHTML = file.name;
        let documento_fichaAcademica = <File>file;
        if(this.proyecto.estudiante2._id === this.info._id){
          this.documento_fichaAcademica.append('documento_fichaAcademica2', documento_fichaAcademica, documento_fichaAcademica.name);
        }else if(this.proyecto.estudiante3){
          if(this.proyecto.estudiante3._id === this.info._id){
            this.documento_fichaAcademica.append('documento_fichaAcademica3', documento_fichaAcademica, documento_fichaAcademica.name);
          }
        }
      }else{
        this.documento_fichaAcademica = new FormData();
        this.fichaValid = false;
        Swal.fire({
          title: '¡Lo Sentimos!',
          html: `<p> El archivo deber ser en formato pdf</p>`,
          icon: 'error',
          confirmButtonText: 'Ok',
          showCancelButton: false,
          confirmButtonColor: '#60D89C',
        }).then(() => {
          labelFicha.setAttribute("style", "");
          labelFicha.innerHTML = "Click para subir el archivo del anteproyecto"
        });
      }
    }
  }

  aceptarProyecto(){
    Swal.fire({
      text: '¿Confirmas ser parte del proyecto y enviar la ficha académica?',
      icon: 'question',
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
            b.textContent = "Aceptando proyecto";
            this._proyectoService.aceptarProyecto(this.proyecto._id).subscribe((resp:any)=>{
              if(resp){
                this._proyectoService.uploadDocumento(this.proyecto._id, this.documento_fichaAcademica).subscribe(async(respp:any)=>{
                  if(respp){
                    let currentDate = new Date();
                    let noti = new Notificacion(
                      resp.estudiante._id,
                      currentDate,
                      "Tu compañero acepto ser parte del proyecto",
                      `${this.info.nombres} ${this.info.apellidos} ha aceptado ser parte del proyecto de grado`,
                      'Estudiante',
                      resp.estudiante.correo);
                    b.textContent = "Enviando notificación a tu compañero"
                    await this._notificacionService.postNotificacion(noti).toPromise();
                    await this._notificacionService.sendNotificacionCorreo(noti).toPromise();
                    if(resp.estado == "Enviado"){
                      let currentDate = new Date();
                      let estudiante = resp.estudiante.nombres+" "+resp.estudiante.apellidos;
                      let txt = "ha";
                      if(resp.estudiante2 && !resp.estudiante3){
                        txt = "han";
                        estudiante = estudiante+" y "+resp.estudiante2.nombres+" "+resp.estudiante2.apellidos;
                      }else if(resp.estudiante2 && resp.estudiante3){
                        estudiante = estudiante+", "+resp.estudiante2.nombres+" "+resp.estudiante2.apellidos;
                      }
                      if(resp.estudiante3){
                        estudiante = estudiante+" y "+resp.estudiante3.nombres+" "+resp.estudiante3.apellidos
                      }
                      let notificacion = new Notificacion(
                        this.jefe._id,
                        currentDate,
                        'Nueva solicitd de proyecto de grado',
                        `${estudiante} te ${txt} enviado una solicitud de proyecto de grado`,
                        'Administrativo',
                        this.jefe.correo);
                      b.textContent = "Enviando notificación al jefe de programa";  
                      await this._notificacionService.postNotificacion(notificacion).toPromise();
                      await this._notificacionService.sendCorreoProyectoArchivo(resp.documento_propuesta, resp._id, notificacion).toPromise();
                    }                
                    Swal.fire({
                      title: '¡Bien Hecho!',
                      text: `Ya eres parte del proyecto`,
                      icon: 'success',
                      showCloseButton: false,
                      showConfirmButton: false,
                      showCancelButton: false,
                      allowEnterKey: false,
                      allowOutsideClick:false,
                      allowEscapeKey: false,
                      timer: 1000,
                      timerProgressBar: true
                    }).then((result) => {
                      if(result.value || result.dismiss){
                        this.router.navigate(["/panel-principal"]);
                      }else{
                        this.router.navigate(["/panel-principal"]);
                      }
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

  rechazarProyecto(){
    Swal.fire({
      text: '¿Rechazas ser parte del proyecto?',
      icon: 'question',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si',
      showCancelButton: true,
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.value) {
        this._proyectoService.rechazarProyecto(this.proyecto._id).subscribe((resp:any)=>{
          let currentDate = new Date();
          let noti = new Notificacion(
            resp.estudiante._id,
            currentDate,
            "Tu compañero rechazo ser parte del proyecto",
            `${this.info.nombres} ${this.info.apellidos} ha rechazado ser parte del proyecto de grado`,
            'Estudiante',
            resp.estudiante.correo);
            this._notificacionService.postNotificacion(noti).subscribe();
            this._notificacionService.sendNotificacionCorreo(noti).subscribe();
            Swal.fire({
              text: `Rechazaste ser parte del proyecto, puedes inscribir otra modalidad`,
              icon: 'success',
              showCloseButton: false,
              showConfirmButton: false,
              showCancelButton: false,
              allowEnterKey: false,
              allowOutsideClick:false,
              allowEscapeKey: false,
              timer: 3000,
              timerProgressBar: true
            }).then((result) => {
              if(result.value || result.dismiss){
                this.router.navigate(["/modalidades"]);
              }else{
                this.router.navigate(["/modalidades"]);
              }
            });
        });
      }
    });
  }


}
