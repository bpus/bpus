import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { URL_SERVICES } from '../../config/config';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  // Definimos una variable global "token" para después asignarle un valor
  token: string;

  constructor(private http: HttpClient, private router:Router) {
  }

  logueado() {
    this.token = localStorage.getItem("token");
    if(this.token){
      return (this.token.length > 15) ? true : false;
    }else{
      return false;
    }
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  olvidoClave(usuario:any){
    let url = `${URL_SERVICES}/login/olvidoClave`;
    return this.http.post(url, usuario).pipe(map((resp: any) => {
      return resp.ok;
    }),catchError((err) => {
      Swal.fire({
        title: '¡Error!',
        text: err.error.mensaje,
        icon: 'error',
        confirmButtonColor: '#8F141B'
      });
      return throwError(err);
    }));
  }


  login(usuario: Usuario) {
    let url = URL_SERVICES + '/login';
    return this.http.post(url, usuario).pipe(map((resp: any) => {
        localStorage.setItem('token', resp.token);
        this.token = resp.token;
        let usuario= (JSON.parse(atob(this.token.split('.')[1]))).usuario;
        usuario.rol = usuario.rol.nombre;
        if(usuario.rol === "JEFE_PROGRAMA"){
          usuario.rol = "JEFE DE PROGRAMA";
        }else if(usuario.rol === "ENCARGADO_EMPRESA"){
          usuario.rol = "ENCARGADO DE EMPRESA"
        }
        localStorage.setItem('user',JSON.stringify(usuario));
        if(resp.modalidad){
          localStorage.setItem('modalidad',JSON.stringify(resp.modalidad));
        }
        if(resp.menu){
          localStorage.setItem('menu',JSON.stringify(resp.menu));
        }
        return true;
    }),catchError((err) => {
        Swal.fire({
          title: '¡Error!',
          text: err.error.mensaje,
          icon: 'error',
          confirmButtonColor: '#8F141B'
        });
        return throwError(err);
      }));
  }
}
