import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Pasantia } from '../../models/Pasantia';
import { URL_SERVICES } from 'src/app/config/config';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { throwError } from 'rxjs/internal/observable/throwError';

@Injectable({
  providedIn: 'root'
})
export class PasantiService {

  constructor(public http: HttpClient, public router: Router) { }

  getSolicitudes(programa: string) {
    let url = `${URL_SERVICES}/pasantia/porPrograma/${programa}`;
    return this.http.get(url);
  }

  getSolicitudesEncargado() {
    let url = `${URL_SERVICES}/pasantia/encargado`;
    return this.http.get(url);
  }

  getSolicitudesTutor(tutor: string) {
    let url = `${URL_SERVICES}/pasantia/tutor${tutor}`;
    return this.http.get(url);
  }

  getSolicitudesJurado(jurado: string) {
    let url = `${URL_SERVICES}/pasantia/jurado${jurado}`;
    return this.http.get(url);
  }

  getSolicitudesAsignarJurado(programa: string) {
    let url = `${URL_SERVICES}/pasantia/asignarJurado/${programa}`;
    return this.http.get(url);
  }

  getPasantia(id: string) {
    let url = `${URL_SERVICES}/pasantia/${id}`;
    return this.http.get(url);
  }
  
  getPasantiaFiltro(pasantia: any) {
    let url = `${URL_SERVICES}/pasantia/filtro`;
    return this.http.post(url, pasantia).pipe(map((resp: any) => {
      if (resp.ok) {
        return resp.pasantias;
      }else{
        return false;
      }
    }), catchError((err) => {
      Swal.fire({
        title: '¡Error!',
        text: err.error.mensaje,
        icon: 'error',
      });
      return throwError('Error al obtener las pasantias');
    }));
  }

  postSolicitud(id: String, solicitud: Pasantia) {
    let url = `${URL_SERVICES}/pasantia/${id}`;
    return this.http.post(url, solicitud).pipe(map((resp: any) => {
      if (resp.ok) {
        localStorage.removeItem("user");
        localStorage.setItem("user",  JSON.stringify(resp.estudianteActualizado));
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
      return throwError(err);
    }));
  }

  postSolicitudDirecta(idEstudiante: String, solicitud: Pasantia) {
    let url = `${URL_SERVICES}/pasantia/direct/${idEstudiante}`;
    return this.http.post(url, solicitud).pipe(map((resp: any) => {
      if (resp.ok == true) {
        localStorage.removeItem("user");
        localStorage.setItem("user",  JSON.stringify(resp.estudianteActualizado));
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
      return throwError(err);
    }));
  }

  
  putReInscripcion(id: string, pasantia: any) {
    let url = `${URL_SERVICES}/pasantia/reInscripcion/${id}`;
    return this.http.put(url, pasantia).pipe(map((resp: any) => {
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

  cambiarEstadoEncargado(id: String, estado: boolean) {
    let url = `${URL_SERVICES}/pasantia/cambiarEstado${id}?estado=${estado}`;
    return this.http.put(url, estado).pipe(map((resp: any) => {
      if (resp.ok == true) {
        return true;
      }else{
        return false;
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

  putSolicitudPropuesta(id: string, pasantia: any) {
    let url = `${URL_SERVICES}/pasantia/propuesta${id}`;
    return this.http.put(url, pasantia).pipe(map((resp: any) => {
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

  putSolicitudJefe(id: string, pasantia: any) {
    let url = `${URL_SERVICES}/pasantia/jefe${id}`;
    return this.http.put(url, pasantia).pipe(map((resp: any) => {
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

  putSolicitudTutor(id: string, pasantia: any) {
    let url = `${URL_SERVICES}/pasantia/tutor${id}`;
    return this.http.put(url, pasantia).pipe(map((resp: any) => {
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

  asignarJurado(id: string, pasantia: any) {
    let url = `${URL_SERVICES}/pasantia/asignarJurados${id}`;
    return this.http.put(url, pasantia).pipe(map((resp: any) => {
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

  evaluar(id: string, pasantia: any) {
    let url = `${URL_SERVICES}/pasantia/evaluar${id}`;
    return this.http.put(url, pasantia).pipe(map((resp: any) => {
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

  postDocumentoPropuesta(idEstudiante: string, documento_propuesta: FormData) {
    let url = `${URL_SERVICES}/upload_pasantia/${idEstudiante}`;
    return this.http.put(url, documento_propuesta).pipe(map((resp: any) => {
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

  putDocumentoPropuesta(idEstudiante: string, documento_actpropuesta: FormData) {
    let url = `${URL_SERVICES}/upload_pasantia/${idEstudiante}`;
    return this.http.put(url, documento_actpropuesta).pipe(map((resp: any) => {
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

  postCartaPresentacion(idEstudiante: string, carta_presentacion: FormData,) {
    
    let url = `${URL_SERVICES}/upload_pasantia/${idEstudiante}`;
    return this.http.put(url, carta_presentacion).pipe(map((resp: any) => {
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

  postDocumentoFichaAcademica(idEstudiante: string, documento_fichaAcademica: FormData) {
    
    let url = `${URL_SERVICES}/upload_pasantia/${idEstudiante}`;
    return this.http.put(url, documento_fichaAcademica).pipe(map((resp: any) => {
      if (resp.ok == true) {
        return resp.pasantia;
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

  postDocumentoActInicio(idEstudiante: string, documento_actaInicio: FormData, fecha_actaInicio: string) {
    
    let url = `${URL_SERVICES}/upload_pasantia/${idEstudiante}?fecha_actaInicio=${fecha_actaInicio}`;
    return this.http.put(url, documento_actaInicio).pipe(map((resp: any) => {
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

  postDocumentoARL(idEstudiante: string, documento_arl: FormData, fecha_arl:string) {
    
    let url = `${URL_SERVICES}/upload_pasantia/${idEstudiante}?fecha_arl=${fecha_arl}`;
    return this.http.put(url, documento_arl).pipe(map((resp: any) => {
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

  postDocumentoInf7(idEstudiante: string, documento_informe7: FormData) {
    
    let url = `${URL_SERVICES}/upload_pasantia/${idEstudiante}`;
    return this.http.put(url, documento_informe7).pipe(map((resp: any) => {
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

  postDocumentoInf14(idEstudiante: string, documento_informe14: FormData) {
    
    let url = `${URL_SERVICES}/upload_pasantia/${idEstudiante}`;
    return this.http.put(url, documento_informe14).pipe(map((resp: any) => {
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

  postDocumentoInfFinal(idEstudiante: string, documento_informeFinal: FormData) {
    
    let url = `${URL_SERVICES}/upload_pasantia/${idEstudiante}`;
    return this.http.put(url, documento_informeFinal).pipe(map((resp: any) => {
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

  postDocumentoAprobacionEmpresa(idEstudiante: string, documento_aprobacionEmpresa: FormData) {
    
    let url = `${URL_SERVICES}/upload_pasantia/${idEstudiante}`;
    return this.http.put(url, documento_aprobacionEmpresa).pipe(map((resp: any) => {
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

  postDocumentoEvaluacion(idEstudiante: string, jurado:string, documento_evaluacion_jurado: FormData) {

    let url = `${URL_SERVICES}/upload_pasantia/${idEstudiante}?jurado=${jurado}`;
    return this.http.put(url, documento_evaluacion_jurado).pipe(map((resp: any) => {
      if (resp.ok == true) {
        return resp.pasantiaActualizada;
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
