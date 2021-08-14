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
export class LineaInvestigacionService {

  constructor(public http: HttpClient, public router: Router) { }

  getlineasTodas() {
    let url = `${URL_SERVICES}/lineaInvestigacion/todas`;
    return this.http.get(url).pipe(map((resp: any) => {
      if (resp.ok) {
        return resp.lineasInvestigacion;
      }else{
        return false;
      }
    }), catchError((err) => {
      return throwError(
        Swal.fire({
          title: '¡Error!',
          text: err.error.mensaje,
          icon: 'error',
        })
      );
    }));
  }

  getlineasJefe(programa:string) {
    let url = `${URL_SERVICES}/lineaInvestigacion/jefe/${programa}`;
    return this.http.get(url).pipe(map((resp: any) => {
      if (resp.ok) {
        return resp.lineasInvestigacion;
      }else{
        return false;
      }
    }), catchError((err) => {
      return throwError(
        Swal.fire({
          title: '¡Error!',
          text: err.error.mensaje,
          icon: 'error',
        })
      );
    }));
  }

  getlineasEstudiante(programa:string) {
    let url = `${URL_SERVICES}/lineaInvestigacion/estudiante/${programa}`;
    return this.http.get(url).pipe(map((resp: any) => {
      if (resp.ok) {
        return resp.lineasInvestigacion;
      }else{
        return false;
      }
    }), catchError((err) => {
      return throwError(
        Swal.fire({
          title: '¡Error!',
          text: err.error.mensaje,
          icon: 'error',
        })
      );
    }));
  }

  postlinea(linea:any) {
    let url = `${URL_SERVICES}/lineaInvestigacion/`;
    return this.http.post(url,linea).pipe(map((resp: any) => {
      return resp.ok;
    }), catchError((err) => {
      return throwError(
        Swal.fire({
          title: '¡Error!',
          text: err.error.mensaje,
          icon: 'error',
        })
      );
    }));
  }

  putlinea(id:string, linea:any) {
    let url = `${URL_SERVICES}/lineaInvestigacion/${id}`;
    return this.http.put(url,linea).pipe(map((resp: any) => {
      return resp.ok;
    }), catchError((err) => {
      return throwError(
        Swal.fire({
          title: '¡Error!',
          text: err.error.mensaje,
          icon: 'error',
        })
      );
    }));
  }

  deletelinea(id:string) {
    let url = `${URL_SERVICES}/lineaInvestigacion/${id}`;
    return this.http.delete(url).pipe(map((resp: any) => {
      return resp.ok;
    }), catchError((err) => {
      return throwError(
        Swal.fire({
          title: '¡Error!',
          text: err.error.mensaje,
          icon: 'error',
        })
      );
    }));
  }

}
