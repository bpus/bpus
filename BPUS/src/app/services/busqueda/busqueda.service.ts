import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { URL_SERVICES } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class BusquedaService {

  constructor(private http: HttpClient, private router: Router) { }

  buscar(tabla:String, busqueda:string) {
    let url = `${URL_SERVICES}/busqueda/coleccion/${tabla}/${busqueda}`;
    return this.http.get(url);
  }
  buscarEstudiante(tabla:String, busqueda:string, programa:string) {
    let url = `${URL_SERVICES}/busqueda/coleccion/${tabla}/${busqueda}?programa=${programa}`;
    return this.http.get(url);
  }

}