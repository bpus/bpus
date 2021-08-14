import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { URL_SERVICES } from 'src/app/config/config';
import { Notificacion } from 'src/app/models/notificacion.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  constructor(public http: HttpClient, public router: Router) { }

  getNotificaciones(usuarioId: String) {
    let url = `${URL_SERVICES}/notificaciones/${usuarioId}`;
    return this.http.get(url);
  }

  getNotificacionesNav(usuarioId: String) {
    let url = `${URL_SERVICES}/notificaciones/notificacionesNav/${usuarioId}`;
    return this.http.get(url);
  }

  postNotificacion(notificacion: Notificacion) {
    let url = `${URL_SERVICES}/notificaciones`;
    return this.http.post(url, notificacion).pipe(map((resp: any) => {
      if(resp.ok){  
        return true;
      }else{
        return false;
      }
    }));
  }

  sendNotificacionCorreo(notificacion: Notificacion) {
    let url = `${URL_SERVICES}/notificaciones/correo`;
    return this.http.post(url, notificacion).pipe(map((resp: any) => {
      if(resp.ok){  
        return true;
      }else{
        return false;
      }
    }));
  }

  sendUSuarioNuevo(usuario: any) {
    let url = `${URL_SERVICES}/notificaciones/usuarioNuevo`;
    return this.http.post(url, usuario).pipe(map((resp: any) => {
      if(resp.ok){  
        return true;
      }else{
        return false;
      }
    }));
  }

  sendCartaPresentacionCorreo(idEstudiante:string ,notificacion: Notificacion) {
    let url = `${URL_SERVICES}/notificaciones/correoCartaPresentacion${idEstudiante}`;
    return this.http.post(url, notificacion).pipe(map((resp: any) => {
      if(resp.ok){  
        return true;
      }else{
        return false;
      }
    }));
  }

  sendPropuestaCorreo(idEstudiante:string ,notificacion: Notificacion) {
    let url = `${URL_SERVICES}/notificaciones/correoPropusta${idEstudiante}`;
    return this.http.post(url, notificacion).pipe(map((resp: any) => {
      if(resp.ok){  
        return true;
      }else{
        return false;
      }
    }));
  }

  sendActInicioCorreo(idEstudiante:string ,notificacion: Notificacion) {
    let url = `${URL_SERVICES}/notificaciones/correoActInicio${idEstudiante}`;
    return this.http.post(url, notificacion).pipe(map((resp: any) => {
      if(resp.ok){  
        return true;
      }else{
        return false;
      }
    }));
  }

  sendInforme7Correo(idEstudiante:string ,notificacion: Notificacion) {
    let url = `${URL_SERVICES}/notificaciones/correoInforme7${idEstudiante}`;
    return this.http.post(url, notificacion).pipe(map((resp: any) => {
      if(resp.ok){  
        return true;
      }else{
        return false;
      }
    }));
  }

  sendInforme14Correo(idEstudiante:string, notificacion: Notificacion) {
    let url = `${URL_SERVICES}/notificaciones/correoInforme14${idEstudiante}`;
    return this.http.post(url, notificacion).pipe(map((resp: any) => {
      if(resp.ok){  
        return true;
      }else{
        return false;
      }
    }));
  }

  sendInformeFinalCorreo(idEstudiante:string, notificacion: Notificacion) {
    let url = `${URL_SERVICES}/notificaciones/correoInformeFinal${idEstudiante}`;
    return this.http.post(url, notificacion).pipe(map((resp: any) => {
      if(resp.ok){  
        return true;
      }else{
        return false;
      }
    }));
  }

  sendArchivosJurado(idEstudiante:string ,notificacion: Notificacion) {
    let url = `${URL_SERVICES}/notificaciones/archivosJurado${idEstudiante}`;
    return this.http.post(url, notificacion).pipe(map((resp: any) => {
      if(resp.ok){  
        return true;
      }else{
        return false;
      }
    }));
  }

  sendEvaluacion(idEstudiante:string, jurado:string, notificacion: Notificacion) {
    let url = `${URL_SERVICES}/notificaciones/evaluacion${idEstudiante}?jurado=${jurado}`;
    return this.http.post(url, notificacion).pipe(map((resp: any) => {
      if(resp.ok){  
        return true;
      }else{
        return false;
      }
    }));
  }

  sendCorreoProyectoArchivo(nombreArchivo:string, idProyecto:string, notificacion: Notificacion){
    let url = `${URL_SERVICES}/notificaciones/correo/proyecto/${nombreArchivo}?idProyecto=${idProyecto}`;
    return this.http.post(url, notificacion).pipe(map((resp: any) => {
      if(resp.ok){  
        return true;
      }else{
        return false;
      }
    }));
  }

  isReadTrue(id: string) {
    let url = `${URL_SERVICES}/notificaciones/leida/${id}`;
    return this.http.put(url, null).pipe(map((resp: any) => {
      if (resp.ok == true) {
        return true;
      }else{
        return false;
      }
    }));
  }

  isReadTodasTrue(receptor: string) {
    let url = `${URL_SERVICES}/notificaciones/leidaTodas/${receptor}`;
    return this.http.put(url, null).pipe(map((resp: any) => {
      return resp.ok;
    }));
  }

  eliminarNotificacion(id: string) {
    let url = `${URL_SERVICES}/notificaciones/${id}`;
    return this.http.delete(url).pipe(map((resp: any) => {
      if (resp.ok == true) {
        return true;
      }else{
        return false;
      }
    }));
  }

  eliminarTodasNotificacion(receptor: string) {
    let url = `${URL_SERVICES}/notificaciones/todas/${receptor}`;
    return this.http.delete(url).pipe(map((resp: any) => {
      if (resp.ok == true) {
        return true;
      }else{
        return false;
      }
    }));
  }

}
