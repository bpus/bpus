import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { URL_SERVICES } from 'src/app/config/config';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { throwError } from 'rxjs/internal/observable/throwError';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {

  totalEstudiantes:number = 0;

  constructor(public http: HttpClient, public router: Router) { }

  getEstudiantes(programa:string, desde: number) {
    let url = `${URL_SERVICES}/estudiantes?programa=${programa}&desde=${desde}`;
    return this.http.get(url).pipe(map((resp: any) => {
      if (resp.ok == true) {
        this.totalEstudiantes = resp.total;
        return resp.estudiantes;
      }else{
        return false;
      }
    }), catchError((err) => {
      return throwError("No se pudo obtener a los estudiantes");
    }));
  }

  getEstudiante(codigo:string) {
    let url = `${URL_SERVICES}/estudiantes/buscarEstudiante/${codigo}`;
    return this.http.get(url);
  }

  cambiarClave(clave:string){
    let url = `${URL_SERVICES}/estudiantes/cambiarclave`;
    return this.http.put(url, {clave: clave}).pipe(map((resp: any) => {
      if (resp.ok == true) {
        localStorage.removeItem("token");
        localStorage.setItem("token", resp.token);
        let usuario= (JSON.parse(atob(resp.token.split('.')[1]))).usuario;
        usuario.rol = usuario.rol.nombre;
        localStorage.setItem('user',JSON.stringify(usuario));
        return true;
      }
    }), catchError((err) => {
      Swal.fire({
        title: '¡Error!',
        text: err.error.mensaje,
        icon: 'error',
      });
      return throwError("No se pudo cambiar la clave");
    }));
  }

  postEstudiante(programa:string, documento_est: FormData) {
    let url = `${URL_SERVICES}/estudiantes/actualizar?programa=${programa}`;
    return this.http.post(url, documento_est).pipe(map((resp: any) => {
      if (resp.ok == true) {
        return true;
      }
    }), catchError((err) => {
      Swal.fire({
        title: '¡Error!',
        text: err.error.mensaje,
        icon: 'error',
      });
      return throwError("No se pudieron crear/actualizar los estudiantes");
    }));
  }

  putTelefono(estudiante:any){
    let url = `${URL_SERVICES}/estudiantes/telefono`;
    return this.http.put(url, estudiante).pipe(map((resp: any) => {
      if (resp.ok == true) {
        return true;
      }
    }), catchError((err) => {
      Swal.fire({
        title: '¡Error!',
        text: err.error.mensaje,
        icon: 'error',
      });
      return throwError("No se pudo editar al usuario");
    }));
  }

}