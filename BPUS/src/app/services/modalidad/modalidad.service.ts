import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ModalidadService {

  // Inyectamos el módulo de Http
  constructor(private http: HttpClient) {}

  // Obtenemos las modalidades del backend
  getModalidades() {
    let url = URL_SERVICES + '/modalidades';
    return this.http.get(url);
  }

  getModalidad(id:string) {
    let url = `${URL_SERVICES}/modalidades/${id}`;
    return this.http.get(url);
  }

  postModalidad(modalidad: any) {
    let url = `${URL_SERVICES}/modalidades`;
    return this.http.post(url, modalidad).pipe(map((resp: any) => {
      if (resp.ok == true) {
        return true;
      }
    }), catchError((err) => {
      Swal.fire({
        title: '¡Error!',
        text: err.error.mensaje,
        icon: 'error',
      });
      return throwError(err);
    }));
  }

  putModalidad(modalidad: any) {
    let url = `${URL_SERVICES}/modalidades`;
    return this.http.put(url, modalidad).pipe(map((resp: any) => {
      if (resp.ok == true) {
        return true;
      }
    }), catchError((err) => {
      Swal.fire({
        title: '¡Error!',
        text: err.error.mensaje,
        icon: 'error',
      });
      return throwError(err);
    }));
  }

  deleteModalidad(id:string){
    let url = `${URL_SERVICES}/modalidades/${id}`;
    return this.http.delete(url).pipe(map((resp: any) => {
      if (resp.ok == true) {
        return true;
      }
    }), catchError((err) => {
      Swal.fire({
        title: '¡Error!',
        text: err.error.mensaje,
        icon: 'error',
      });
      return throwError(err);
    }));
  }

}
