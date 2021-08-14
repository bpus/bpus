import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { Notificacion } from 'src/app/models/notificacion.model';
import { Usuario } from '../../models/usuario.model';
import { EstudianteService, AdministrativoService, NotificacionesService, LoginService } from 'src/app/services/service.index'; 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cambio-clave',
  templateUrl: './cambio-clave.component.html',
  styleUrls: ['./cambio-clave.component.css']
})
export class CambioClaveComponent implements OnInit, OnDestroy {

  invalidPassword:boolean = true;
  passwordsMatch:boolean = false;
  contador:Subscription;
  token:string;
  info:any;

  constructor(private router: Router,
    private _loginService: LoginService,
    private activatedRoute: ActivatedRoute, 
    private _estudianteService: EstudianteService,
    private _notiService: NotificacionesService,
    private _administrativoService: AdministrativoService) { }

  ngOnInit(): void {

    this.token = this.activatedRoute.snapshot.params.token; 

    if(this.token === null){
      this.router.navigate(['/login']); 
    }else{
      this.info = (JSON.parse(atob(this.token.split('.')[1]))).usuario;
      this.checkToken();
      this.contador = interval(1000*60).subscribe((n) => {
        this.checkToken();
      });
    }
  }

  checkToken(){
    try {
      let payload= (JSON.parse(atob(this.token.split('.')[1]))).exp;
      let expirado = this.expirado(payload);
      if (expirado) {
        this.router.navigate(['/login']);
        return false;
      }else{
        return true;
      }
    } catch (error) {
      this.router.navigate(['/login']);
      return false;
    }
  }

  expirado(fechaExp:number){
    let ahora = new Date().getTime()/1000;
    let diff = fechaExp - ahora;
    if (fechaExp < ahora) {
      return true;
    } else {
      if(diff <= 180 && diff >= 30){
        Swal.fire({
          icon: 'warning',
          text: ` Te quedan menos de ${Math.round(diff/60)} minuto(s) para cambiar la clave!`,
          toast: true,
          position: 'top-right',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: false
        });
      }else if(diff < 30){
        this.router.navigate(['/login']);
      }
      return false;
    }
  }

  cambiarClave(){
    Swal.fire({
      title: "Cambiar contraseña?",
      icon: "question",
      showCancelButton: true,
      showConfirmButton:true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33',
      showCloseButton:false,
    }).then((result) => {
      if(result.value){
        const newPassword = (document.getElementById('newPassword')) as HTMLInputElement;
        localStorage.setItem('token', this.token);
        if(this.info.codigo){
          this._estudianteService.cambiarClave(newPassword.value).subscribe((resp:any) => {
            const noti = new Notificacion(
              this.info._id,
              new Date(),
              "Cambio de contraseña",
              "Tu contraseña para ingresar a la plataforma ha cambiado. Tu nueva contraseña es "+newPassword.value,
              "Estudiante",
              this.info.correo
            );
            this._notiService.sendNotificacionCorreo(noti).subscribe((resp:any)=>{
              Swal.fire({
                title: '¡Bien Hecho!',
                html: "Contraseña cambiada exitosamente",
                icon: 'success',
                allowEnterKey: false,
                allowEscapeKey: false,
                allowOutsideClick: false,
                showCancelButton: false,
                showCloseButton: false,
                showConfirmButton:false,
                timer: 1300,
                timerProgressBar: false
              }).then(() => {
                if(this.info.usuario){
                  let usuario = new Usuario(this.info.usuario, newPassword.value);
                  this._loginService.login(usuario).subscribe((resp) => {
                    const user = JSON.parse(localStorage.getItem("user"));
                    const modalidad = JSON.parse(localStorage.getItem("modalidad"));
                    // Si se inicia un estudiante...
                    if (user.codigo) {
                      if (modalidad !== "No tiene modalidad") {
                        let currentDate = new Date();
                        if(user.onModel === "Proyecto"){
                          if(user._id === modalidad.estudiante._id){
                            localStorage.removeItem("modalidad");
                            if(modalidad.fecha_aprobacion){
                              let fechaInicio = new Date(Date.parse(modalidad.fecha_aprobacion));
                              let diff = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate()) ) /(1000 * 60 * 60 * 24 * 7));
                              if(diff >= 7 && !modalidad.documento_anteproyecto){
                                localStorage.setItem("ProyectoAlertA", diff.toString());
                              }
                              if(diff >= 15 && !modalidad.documento_proyecto){
                                localStorage.setItem("ProyectoAlertP", diff.toString());
                              }
                            }
                            this.router.navigate(['/panel-principal']);
                          }else if(user._id === modalidad.estudiante2?._id){
                            if(modalidad.aprobacionEstudiante2 === true){
                              localStorage.removeItem("modalidad");
                              if(modalidad.fecha_aprobacion){
                                let fechaInicio = new Date(Date.parse(modalidad.fecha_aprobacion));
                                let diff = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate()) ) /(1000 * 60 * 60 * 24 * 7));
                                if(diff >= 7 && !modalidad.documento_anteproyecto){
                                  localStorage.setItem("ProyectoAlertA", diff.toString());
                                }
                                if(diff >= 15 && !modalidad.documento_proyecto){
                                  localStorage.setItem("ProyectoAlertP", diff.toString());
                                }
                              }
                              this.router.navigate(['/panel-principal']);
                            }else{
                              localStorage.setItem('NoEntre',"ApruebaPrimero");
                              this.router.navigate(['/aceptar-proyecto']);
                            }
                          }else if(user._id === modalidad.estudiante3?._id){
                            if(modalidad.aprobacionEstudiante3 === true){
                              localStorage.removeItem("modalidad");
                              if(modalidad.fecha_aprobacion){
                                let fechaInicio = new Date(Date.parse(modalidad.fecha_aprobacion));
                                let diff = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate()) ) /(1000 * 60 * 60 * 24 * 7));
                                if(diff >= 7 && !modalidad.documento_anteproyecto){
                                  localStorage.setItem("ProyectoAlertA", diff.toString());
                                }
                                if(diff >= 15 && !modalidad.documento_proyecto){
                                  localStorage.setItem("ProyectoAlertP", diff.toString());
                                }
                              }
                              this.router.navigate(['/panel-principal']);
                            }else{
                              localStorage.setItem('NoEntre',"ApruebaPrimero");
                              this.router.navigate(['/aceptar-proyecto']);
                            }
                          }
                        }else{
                          if(modalidad.fecha_actaInicio){
                            let fechaInicio = new Date(Date.parse(modalidad.fecha_actaInicio));
                            let diff = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate()) ) /(1000 * 60 * 60 * 24 * 7));
                            if(diff >= 6 && !modalidad.documento_informe7){
                              localStorage.setItem("PasantiaAlert7", diff.toString());
                            }
                            if(diff >= 13 && !modalidad.documento_informe14){
                              localStorage.setItem("PasantiaAlert14", diff.toString());
                            }
                            if(diff >= 23 && !modalidad.documento_informeFinal){
                              localStorage.setItem("PasantiaAlertFinal", diff.toString());
                            }
                          }
                          localStorage.removeItem("modalidad");
                          this.router.navigate(['/panel-principal']);
                        }
                      } else {
                        localStorage.removeItem("modalidad");
                        this.router.navigate(['/modalidades']);
                      }
                    } else{
                      this.router.navigate(['/panel-principal']);
                    }
                  });
                }else{
                  const modalidad = JSON.parse(localStorage.getItem("modalidad"));
                  if (modalidad !== "No tiene modalidad") {
                    if(modalidad.onModel === "Proyecto"){
                      if(this.info._id === modalidad.estudiante._id){
                        localStorage.removeItem("modalidad");
                        this.router.navigate(['/panel-principal']);
                      }else if(this.info._id === modalidad.estudiante2?._id){
                        if(modalidad.aprobacionEstudiante2 === true){
                          localStorage.removeItem("modalidad");
                          this.router.navigate(['/panel-principal']);
                        }else{
                          localStorage.setItem('NoEntre',"ApruebaPrimero");
                          this.router.navigate(['/aceptar-proyecto']);
                        }
                      }else if(this.info._id === modalidad.estudiante3?._id){
                        if(modalidad.aprobacionEstudiante3 === true){
                          localStorage.removeItem("modalidad");
                          this.router.navigate(['/panel-principal']);
                        }else{
                          localStorage.setItem('NoEntre',"ApruebaPrimero");
                          this.router.navigate(['/aceptar-proyecto']);
                        }
                      }
                    }else{
                      localStorage.removeItem("modalidad");
                      this.router.navigate(['/panel-principal']);
                    }
                  } else {
                    localStorage.removeItem("modalidad");
                    this.router.navigate(['/modalidades']);
                  }
                }
              });
            });
          });
        }else{
          this._administrativoService.cambiarClave(this.info._id, newPassword.value).subscribe((resp:any) => {
            const noti = new Notificacion(
              this.info._id,
              new Date(),
              "Cambio de contraseña",
              "Tu contraseña para ingresar a la plataforma ha cambiado. Tu nueva contraseña es "+newPassword.value,
              "Administrativo",
              this.info.correo
            );
            this._notiService.sendNotificacionCorreo(noti).subscribe((resp:any)=>{
              Swal.fire({
                title: '¡Bien Hecho!',
                html: "Contraseña cambiada exitosamente",
                icon: 'success',
                allowEnterKey: false,
                allowEscapeKey: false,
                allowOutsideClick: false,
                showCancelButton: false,
                showCloseButton: false,
                showConfirmButton:false,
                timer: 1300,
                timerProgressBar: false
              }).then(() => {
                if(this.info.estado){
                  let usuario = new Usuario(this.info.identificacion, newPassword.value);
                  this._loginService.login(usuario).subscribe((resp:any)=>{
                    this.router.navigate(['/panel-principal']);
                  })
                }else{
                  this.router.navigate(['/panel-principal']);
                }
              });
            });
          })
        }
      }
    });
  }

  checkPassword(){
    const newPassword = (document.getElementById('newPassword')) as HTMLInputElement;
    const invalidPassword = (document.getElementById('invalidPassword')) as HTMLInputElement;
    if (newPassword.value.match('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\=])(?=.{8,32})')) {
      this.invalidPassword = false;
      invalidPassword.setAttribute('style','display: none');
    } else if(newPassword.value == ''){
      this.invalidPassword = true;
      invalidPassword.setAttribute('style','display: none');
    }else{
      this.invalidPassword = true;
      invalidPassword.setAttribute('style','color: red; display: block');
    }
  }

  matchPasswords(){
    const newPassword = (document.getElementById('newPassword')) as HTMLInputElement;
    const confirmNewPassword = (document.getElementById('confirmNewPassword')) as HTMLInputElement;
    const mismatch = (document.getElementById('mismatch')) as HTMLInputElement;
    if(newPassword.value === confirmNewPassword.value){
      this.passwordsMatch = true;
      mismatch.setAttribute('style','display: none');
    }else if(newPassword.value == '' || confirmNewPassword.value == ''){
      this.passwordsMatch = false;
      mismatch.setAttribute('style','display: none');
    }else{
      mismatch.setAttribute('style','color: red; display:block');
      this.passwordsMatch = false;
    }
  }

  showpassword(inputId: string, iconId: string) {
    const password = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (password.getAttribute('type') === 'password') {
      password.setAttribute('type', 'text');
      icon.setAttribute('class', 'fa fa-eye-slash');
    } else {
      password.setAttribute('type', 'password');
      icon.setAttribute('class', 'fa fa-eye');
    }
  }

  ngOnDestroy():void {
    this.contador.unsubscribe();
  }

}
