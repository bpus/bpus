import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProgramaService {
  totalprogramas:number = 0;

  constructor(public http: HttpClient) { }

  getProgramas(desde:number) {
    let url = `${URL_SERVICES}/programa?desde=${desde}`;
    return this.http.get(url).pipe(map((resp: any) => {
      if (resp.ok == true) {
        this.totalprogramas = resp.total;
        return resp.programas;
      }else{
        return false;
      }
    }));
  }

  getTodosProgramas() {
    let url = `${URL_SERVICES}/programa/todos`;
    return this.http.get(url).pipe(map((resp: any) => {
      if (resp.ok == true) {
        return resp.programas;
      }else{
        return false;
      }
    }));
  }

  // Función para obtener el programa que corresponde el estudiante
  getPrograma() {
    let url = `${URL_SERVICES}/programa/programaEstudiante`;
    return this.http.get(url);
  }

  postPrograma(programa:any){
    let url = `${URL_SERVICES}/programa`;
    return this.http.post(url, programa).pipe(map((resp: any) => {
      return resp.ok;
    }));
  }

  putPrograma(id:string, programa:any){
    let url = `${URL_SERVICES}/programa/${id}`;
    return this.http.put(url, programa).pipe(map((resp: any) => {
      return resp.ok;
    }));
  }

  deletePrograma(id:string){
    let url = `${URL_SERVICES}/programa/${id}`;
    return this.http.delete(url).pipe(map((resp: any) => {
      return resp.ok;
    }));
  }

}
