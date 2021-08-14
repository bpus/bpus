import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Empresa } from '../../models/Empresa.model';
import { URL_SERVICES } from 'src/app/config/config';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { throwError } from 'rxjs/internal/observable/throwError';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(public http: HttpClient, public router: Router) { }

  getEmpresas() {
    let url = `${URL_SERVICES}/empresas`;
    return this.http.get(url);
  }

  getEmpresasEncargado(encargadoID:String) {
    let url = `${URL_SERVICES}/empresas/empresa/${encargadoID}`;
    return this.http.get(url);
  }

  postEmpresa(empresa: Empresa) {    
    let url = `${URL_SERVICES}/empresas`;
    return this.http.post(url, empresa).pipe(map((resp: any) => {
      if (resp.ok == true) {
        return resp.empresaGuardada;
      }
    }), catchError((err) => {
      Swal.fire({
        title: '¡Error!',
        text: err.error.mensaje,
        icon: 'error',
      });
      return throwError("No se pudo crear la empresa");
    }));

  }

  putEmpresa(id: String, empresa: Empresa) {
    let url = `${URL_SERVICES}/empresas/${id}`;
    return this.http.put(url, empresa).pipe(map((resp: any) => {
      if (resp.ok == true) {
        return resp.empresaActualizada;
      }
    }), catchError((err) => {
      Swal.fire({
        title: '¡Error!',
        text: err.error.mensaje,
        icon: 'error',
      });
      return throwError("No se pudo editar la empresa");
    }));

  }

  deleteEmpresa(id: string) {
    let url = `${URL_SERVICES}/empresas/${id}`;
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
      return throwError("No se pudo eliminar la empresa");
    }));
  }

}

