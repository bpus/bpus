import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Convenio } from '../../models/Convenio.model';
import { URL_SERVICES } from 'src/app/config/config';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { throwError } from 'rxjs/internal/observable/throwError';

@Injectable({
  providedIn: 'root'
})
export class ConvenioService {

  totalConvenios:number = 0;

  constructor(public http: HttpClient, public router: Router) { }

  getConveniosPrograma(programa:String) {
    let url = `${URL_SERVICES}/convenios/programa${programa}`;
    return this.http.get(url);
  }

  getConvenios(desde:number) {
    let url = `${URL_SERVICES}/convenios?desde=${desde}`;
    return this.http.get(url).pipe(map((resp: any) => {
      if (resp.ok == true) {
        this.totalConvenios = resp.total;
        return resp.convenios;
      }else{
        return false;
      }
    }));
  }

  getConvenioEncargado(convenio: string) {
    let url = `${URL_SERVICES}/convenios/encargado${convenio}`;
    return this.http.get(url);
  }


  postConvenio(convenio: Convenio) {
    let url = `${URL_SERVICES}/convenios`;
    return this.http.post(url, convenio).pipe(map((resp: any) => {
      if (resp.ok == true) {
        return resp.convenioGuardado;
      }
    }), catchError((err) => {
      Swal.fire({
        title: '¡Error!',
        text: err.error.mensaje,
        icon: 'error',
      });
      return throwError("No se pudo crear el convenio");
    }));
  }

  putConvenio(id: String, convenio: Convenio) {
    let url = `${URL_SERVICES}/convenios/${id}`;
    return this.http.put(url, convenio).pipe(map((resp: any) => {
      if (resp.ok == true) {
        Swal.fire({
          title: '¡Bien Hecho!',
          text: 'convenio actualizado correctamente',
          icon: 'success'
        }).then(() => {
          location.reload();
        });
      }
      return true;
    }), catchError((err) => {
      Swal.fire({
        title: '¡Error!',
        text: err.error.mensaje,
        icon: 'error',
      });
      return throwError("No se pudo editar el convenio");
    }));
  }

  postDocumentoConvenio(idConvenio: string, documento_convenio: FormData) {
    let url = `${URL_SERVICES}/upload_convenio/${idConvenio}`;
    return this.http.put(url, documento_convenio).pipe(map((resp: any) => {
      if (resp.ok == true) {
        return true;
      }
    }), catchError((err) => {
      Swal.fire({
        title: '¡Error!',
        text: err.error.mensaje,
        icon: 'error',
      });
      return throwError("No se pudo guardar el archivo del convenio");
    }));
  }

  deleteConvenio(id: string) {    
    let url = `${URL_SERVICES}/convenios/${id}`;
    return this.http.delete(url).pipe(map((resp: any) => {
      if (resp.ok == true) {
        Swal.fire({
          title: '¡Bien Hecho!',
          text: 'Convenio eliminado correctamente',
          icon: 'success'
        }).then(() => {
          location.reload();
        });
      }
      return true;
    }), catchError((err) => {
      Swal.fire({
        title: '¡Error!',
        text: err.error.mensaje,
        icon: 'error',
      });
      return throwError("No se pudo eliminar el convenio");
    }));
  }
}