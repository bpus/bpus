import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from 'src/app/config/config';
import { throwError } from 'rxjs/internal/observable/throwError';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http: HttpClient) { }

  getRoles() {
    let url = `${URL_SERVICES}/roles`;
    return this.http.get(url);
  }


  getRolesOnlyName() {
    let url = `${URL_SERVICES}/roles/onlyName`;
    return this.http.get(url);
  }

  postRol(rol: any) {
    let url = `${URL_SERVICES}/roles`;
    return this.http.post(url, rol).pipe(map((resp: any) => {
      if (resp.ok == true) {
        return resp.rolGuardado;
      }
    }), catchError((err) => {
      Swal.fire({
        title: '¡Error!',
        text: err.error.mensaje,
        icon: 'error',
      });
      return throwError("No se pudo crear el rol");
    }));
  }

  putRol(rol: any) {
    let url = `${URL_SERVICES}/roles`;
    return this.http.put(url, rol).pipe(map((resp: any) => {
      if (resp.ok == true) {
        return resp.rolGuardado;
      }
    }), catchError((err) => {
      Swal.fire({
        title: '¡Error!',
        text: err.error.mensaje,
        icon: 'error',
      });
      return throwError("No se pudo editar el rol");
    }));
  }

}