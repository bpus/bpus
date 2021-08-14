import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoginService } from 'src/app/services/service.index';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  // la variable recordar pertenece al check "recordarme", por defecto será falso
  usuario: string;
  mostrarcontra: boolean = false;
  // Inyectamos el servicio del login, y el Router
  constructor(public __loginService: LoginService, public router: Router) { }

  ngOnInit(): void {
    // Siempre cuando se cargue el login, va a activar la función
    this.logout();
  }

  // Se crea la función que se activará cuando se presione el botón de iniciar sesión
  ingresar(form: NgForm) {
    // Se crea una variable de tipo Usuario
    let usuario = new Usuario(form.value.usuario, form.value.contrasena);

    // Llamamos a la función login del servicio Login y le pasamos el usuario y la variable recordar
    this.__loginService.login(usuario).subscribe((resp) => {
      const user = JSON.parse(localStorage.getItem("user"));
      const modalidad = JSON.parse(localStorage.getItem("modalidad"));
      if(user.password === '$Pl3aSeC4mbI3D3clV3#&'){
        let token = localStorage.getItem("token");
        localStorage.removeItem("token");
        this.router.navigate(['/cambio-contraseña', token]);
      }else{
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
      }
    });
  }

  // Función para eliminar los datos de sesión
  logout() {
    localStorage.clear();
  }

  showPass(){
    const inputContra = (document.getElementById('inputContra')) as HTMLInputElement;
    if(this.mostrarcontra){
      inputContra.setAttribute('type', 'text');
    }else{
      inputContra.setAttribute('type', 'password');
    }
  }
}
