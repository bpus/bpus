import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from 'src/app/config/config';
import { throwError } from 'rxjs/internal/observable/throwError';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  constructor(public http: HttpClient) { }

  getPermisos() {
    let url = `${URL_SERVICES}/permisos`;
    return this.http.get(url);
  }

  getPermisosPagina(pagina:string) {
    let url = `${URL_SERVICES}/permisos/pagina${pagina}`;
    return this.http.get(url);
  }

  postPermiso(permiso: any) {
    let url = `${URL_SERVICES}/permisos`;
    return this.http.post(url, permiso).pipe(map((resp: any) => {
      if (resp.ok == true) {
        return resp.permisoGuardado;
      }
    }), catchError((err) => {
      Swal.fire({
        title: '¡Error!',
        text: err.error.mensaje,
        icon: 'error',
      });
      return throwError("No se pudo crear el permiso");
    }));
  }

  putPermiso(permiso: any) {
    let url = `${URL_SERVICES}/permisos`;
    return this.http.put(url, permiso).pipe(map((resp: any) => {
      if (resp.ok == true) {
        return resp.permisoActualizado;
      }
    }), catchError((err) => {
      Swal.fire({
        title: '¡Error!',
        text: err.error.mensaje,
        icon: 'error',
      });
      return throwError("No se pudo editar el permiso");
    }));
  }

  deletePermiso(id:string){
    let url = `${URL_SERVICES}/permisos/${id}`;
    return this.http.delete(url).pipe(map((resp: any) => {
      return resp.ok;
    }), catchError((err) => {
      Swal.fire({
        title: '¡Error!',
        text: err.error.mensaje,
        icon: 'error',
      });
      return throwError("No se pudo eliminar el permiso");
    }));
  }

}