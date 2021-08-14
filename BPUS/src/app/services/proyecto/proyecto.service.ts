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
export class ProyectoService {

  constructor(public http: HttpClient, public router: Router) { }

  getProyecto(id:string) {
    let url = `${URL_SERVICES}/proyecto/estudiante/${id}`;
    return this.http.get(url);
  }

  getProyectoEnviados(programa:string) {
    let url = `${URL_SERVICES}/proyecto/porPrograma/${programa}`;
    return this.http.get(url);
  }

  getProyectosDirector(director:string){
    let url = `${URL_SERVICES}/proyecto/director/${director}`;
    return this.http.get(url);
  }

  getProyectosAsignarJurados(programa:string){
    let url = `${URL_SERVICES}/proyecto/asignarJurado/${programa}`;
    return this.http.get(url);
  }

  getProyectosJurado(jurado:string){
    let url = `${URL_SERVICES}/proyecto/jurado/${jurado}`;
    return this.http.get(url);
  }

  getProyectosFiltro(proyecto:any){
    let url = `${URL_SERVICES}/proyecto/filtro`;
    return this.http.post(url, proyecto).pipe(map((resp: any) => {
      if (resp.ok) {
        return resp.proyectos;
      }else{
        return false;
      }
    }), catchError((err) => {
      Swal.fire({
        title: '¡Error!',
        text: err.error.mensaje,
        icon: 'error',
      });
      return throwError('Error al obtener los proyectos');
    }));
  }

  postProyecto(proyecto: any) {
    let url = `${URL_SERVICES}/proyecto`;
    return this.http.post(url, proyecto).pipe(map((resp: any) => {
      if (resp.ok) {
        let user = JSON.parse(localStorage.getItem("user"));
        localStorage.removeItem("user");
        user.onModel = resp.estudianteSave.onModel;
        user.modalidad = resp.estudianteSave.modalidad;
        localStorage.setItem("user",  JSON.stringify(user));
        return resp.solicitudGuardada;
      }else{
        return false;
      }
    }), catchError((err) => {
      Swal.fire({
        title: '¡Error!',
        text: err.error.mensaje,
        icon: 'error',
      });
      return throwError('No se pudo crear el proyecto');
    }));
  }

  aceptarProyecto(idProyecto: string){
    let url = `${URL_SERVICES}/proyecto/aprobarSerParteProyecto/${idProyecto}`;
    return this.http.put(url, null).pipe(map((resp: any) => {
      if (resp.ok) {
        let user = JSON.parse(localStorage.getItem("user"));
        localStorage.removeItem("user");
        user.modalidad = user.modalidad._id;
        localStorage.setItem("user",  JSON.stringify(user));
        localStorage.removeItem("NoEntre");
        localStorage.removeItem("modalidad");
        return resp.proyectoSave;
      }else{
        return false;
      }
    }), catchError((err) => {
      Swal.fire({
        title: '¡Error!',
        text: err.error.mensaje,
        icon: 'error',
      });
      return throwError("Error al aceptar el proyecto");
    }));
  }

  rechazarProyecto(idProyecto: string){
    let url = `${URL_SERVICES}/proyecto/rechazarSerParteProyecto/${idProyecto}`;
    return this.http.put(url, null).pipe(map((resp: any) => {
      if (resp.ok) {
        let user = JSON.parse(localStorage.getItem("user"));
        localStorage.removeItem("user");
        delete user.modalidad;
        localStorage.setItem("user",  JSON.stringify(user));
        localStorage.removeItem("NoEntre");
        localStorage.removeItem("modalidad");
        return resp.proyectoSave;
      }else{
        return false;
      }
    }), catchError((err) => {
      Swal.fire({
        title: '¡Error!',
        text: err.error.mensaje,
        icon: 'error',
      });
      return throwError("Error al rechazar el proyecto");
    }));
  }

  putJefeProyecto(idProyecto: string, proyecto:any){
    let url = `${URL_SERVICES}/proyecto/jefeProyecto/${idProyecto}`;
    return this.http.put(url, proyecto).pipe(map((resp: any) => {
      return resp.ok;
    }), catchError((err) => {
      Swal.fire({
        title: '¡Error!',
        text: err.error.mensaje,
        icon: 'error',
      });
      return throwError("Error al editar el proyecto");
    }));
  }

  putDirectorProyecto(idProyecto: string, proyecto:any){
    let url = `${URL_SERVICES}/proyecto/directorProyecto/${idProyecto}`;
    return this.http.put(url, proyecto).pipe(map((resp: any) => {
      return resp.proyectoSave;
    }), catchError((err) => {
      Swal.fire({
        title: '¡Error!',
        text: err.error.mensaje,
        icon: 'error',
      });
      return throwError("Error al editar el proyecto");
    }));
  }

  asignarJurados(id: string, proyecto: any) {
    let url = `${URL_SERVICES}/proyecto/asignarJurados/${id}`;
    return this.http.put(url, proyecto).pipe(map((resp: any) => {
      return resp.ok;
    }), catchError((err) => {
      Swal.fire({
        title: '¡Error!',
        text: err.error.mensaje,
        icon: 'error',
      });
      return throwError("Error al asignar los jurados al proyecto");
    }));
  }

  evaluar(id: string, proyecto: any) {
    let url = `${URL_SERVICES}/proyecto/evaluar/${id}`;
    return this.http.put(url, proyecto).pipe(map((resp: any) => {
      return resp.ok;
    }), catchError((err) => {
      Swal.fire({
        title: '¡Error!',
        text: err.error.mensaje,
        icon: 'error',
      });
      return throwError("Error al evaluar el proyecto");
    }));
  }

  uploadDocumento(idProyecto: string, documento: FormData) {
    let url = `${URL_SERVICES}/upload_proyecto/${idProyecto}`;
    return this.http.put(url, documento).pipe(map((resp: any) => {
      if (resp.ok == true) {
        return resp.proyecto;
      }
    }), catchError((err) => {
      Swal.fire({
        title: '¡Error!',
        text: err.error.mensaje,
        icon: 'error',
      });
      return throwError("Error al cargar el documento del proyecto");
    }));
  }

  postDocumentoEvaluacion(idProyecto: string, jurado:string, documento_evaluacion_jurado: FormData) {
    let url = `${URL_SERVICES}/upload_proyecto/${idProyecto}?jurado=${jurado}`;
    return this.http.put(url, documento_evaluacion_jurado).pipe(map((resp: any) => {
      if (resp.ok == true) {
        return resp.proyectoActualizado;
      }
    }), catchError((err) => {
      Swal.fire({
        title: '¡Error!',
        text: err.error.mensaje,
        icon: 'error',
      });
      return throwError("Error al cargar el documento de evaluación del proyecto");
    }));
  }

}