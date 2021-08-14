import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from 'src/app/config/config';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { throwError } from 'rxjs/internal/observable/throwError';

@Injectable({
  providedIn: 'root'
})
export class CredencialesSMTPService {

  constructor(private http: HttpClient) { }

  getCredenciales() {
    let url = `${URL_SERVICES}/credencialesSMTP/`;
    return this.http.get(url);
  }

  putCredenciales(credenciales: any) {
    let url = `${URL_SERVICES}/credencialesSMTP/`;
    return this.http.put(url, credenciales).pipe(map((resp: any) => {
      return resp.ok;
    }), catchError((err) => {
      Swal.fire({
        title: '¡Error!',
        text: err.error.mensaje,
        icon: 'error',
      });
      return throwError("No se pudo editar las credenciales");
    }));
  }

}