import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ProyectoService, NotificacionesService } from 'src/app/services/service.index';
import { Notificacion } from 'src/app/models/notificacion.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.css']
})
export class ProyectoComponent implements OnInit {

  proyecto: any;
  info = JSON.parse(localStorage.getItem('user'));
  fileValid = false;
  documento_proyecto = new FormData();
  MAX_SIZE_FILE: number = 1000000;

  constructor(private _proyectoService: ProyectoService, 
              private _notificacionService: NotificacionesService,
              private router: Router) { }

  ngOnInit(): void {
    (document.getElementById("fileproyecto") as HTMLInputElement).disabled = true;
    if(this.info.modalidad !== null){
      this.getProyecto();
    }else{
      this.router.navigate(["/"])
    }
  }

  getProyecto() {
    this._proyectoService.getProyecto(this.info.modalidad).subscribe((resp: any) => {
      this.proyecto = resp.proyecto;
      if(!this.proyecto.estado_anteproyecto || this.proyecto.estado_proyecto && this.proyecto.estado_proyecto !== 'Ajustar'){
        this.router.navigate(["/"]);
      }else{
        (document.getElementById("fileproyecto") as HTMLInputElement).disabled = false;
      }
    })
  }

  getFilePropuesta(file: File) {
    const labelfileproyecto = document.getElementById("labelfileproyecto") as HTMLElement;
    if (file.size > this.MAX_SIZE_FILE) {
      this.documento_proyecto = new FormData();
      this.fileValid = false;
      Swal.fire({
        title: '¡Lo Sentimos!',
        html: `<p> El archivo: <b>${file.name}</b>, supera el 1 MB</p>`,
        icon: 'error',
        confirmButtonText: 'Ok',
        showCancelButton: false,
        confirmButtonColor: '#60D89C',
      }).then(() => {
        labelfileproyecto.setAttribute("style", "");
        labelfileproyecto.innerHTML = "Click para subir el archivo del proyecto"
      });
    } else {
      const nombreCortado = file.name.split('.');
      const extensionArchivo = nombreCortado[nombreCortado.length - 1];
      const extensionesValidas = ['pdf', 'PDF'];
  
      if (extensionesValidas.indexOf(extensionArchivo) >= 0) {
        this.fileValid = true;
        labelfileproyecto.setAttribute("style", "color: #8F141B; font-weight: bold;");
        labelfileproyecto.innerHTML = file.name;
        let documento_proyecto = <File>file;
        this.documento_proyecto.append('documento_proyecto', documento_proyecto, documento_proyecto.name);
      }else{
        this.documento_proyecto = new FormData();
        this.fileValid = false;
        Swal.fire({
          title: '¡Lo Sentimos!',
          html: `<p> El archivo deber ser en formato pdf</p>`,
          icon: 'error',
          confirmButtonText: 'Ok',
          showCancelButton: false,
          confirmButtonColor: '#60D89C',
        }).then(() => {
          labelfileproyecto.setAttribute("style", "");
          labelfileproyecto.innerHTML = "Click para subir el archivo del proyecto"
        });
      }
    }
  }

  uploadProyecto(){
    Swal.fire({
      title: '¿Enviar documento?',
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
            b.textContent = "Subiendo proyecto";
            this._proyectoService.uploadDocumento(this.proyecto._id, this.documento_proyecto).subscribe(async(resp:any)=>{
              if(resp){
                if(this.proyecto.estado === "En ejecución"){
                  let currentDate = new Date();
                  let notificacion = new Notificacion(
                    this.proyecto.director._id,
                    currentDate,
                    'Envio del proyecto',
                    `Te han enviado el documento de proyecto de: ${resp.titulo}`,
                    'Administrativo',
                    this.proyecto.director.correo
                  );
                  b.textContent = "Enviando notificación al director";
                  await this._notificacionService.postNotificacion(notificacion).toPromise();
                  await this._notificacionService.sendCorreoProyectoArchivo(resp.documento_proyecto, resp._id, notificacion).toPromise();
                }else if(this.proyecto.estado === "Sustentación"){
                  if(this.proyecto.evaluacion_jurado1 === "Ajustar"){
                    let notificacion = new Notificacion(
                      this.proyecto.jurado1._id,
                      new Date(),
                      'Envio del proyecto',
                      `Te han enviado el documento de proyecto actualizado de: ${resp.titulo}`,
                      'Administrativo',
                      this.proyecto.jurado1.correo
                    );
                    b.textContent = "Enviando notificación al jurado: "+this.proyecto.jurado1.nombres+" "+this.proyecto.jurado1.apellidos;
                    await this._notificacionService.postNotificacion(notificacion).toPromise();
                    await this._notificacionService.sendCorreoProyectoArchivo(resp.documento_proyecto, resp._id, notificacion).toPromise();
                  }if(this.proyecto.evaluacion_jurado2 === "Ajustar"){
                    let notificacion = new Notificacion(
                      this.proyecto.jurado2._id,
                      new Date(),
                      'Envio del proyecto',
                      `Te han enviado el documento de proyecto actualizado de: ${resp.titulo}`,
                      'Administrativo',
                      this.proyecto.jurado2.correo
                    );
                    b.textContent = "Enviando notificación al jurado: "+this.proyecto.jurado2.nombres+" "+this.proyecto.jurado2.apellidos;
                    await this._notificacionService.postNotificacion(notificacion).toPromise();
                    await this._notificacionService.sendCorreoProyectoArchivo(resp.documento_proyecto, resp._id, notificacion).toPromise();
                  }
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
                  timerProgressBar: true
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
