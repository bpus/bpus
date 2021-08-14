import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { VacantesService, ConvenioService } from 'src/app/services/service.index';
import { Vacante } from '../../../models/Vacante';
import { Router } from '@angular/router';

declare function init_plugins():any;

@Component({
  selector: 'app-vacantes',
  templateUrl: './vacantes.component.html'
})
export class VacantesComponent implements OnInit {

  vacantes: any[];
  convenio: any;
  encargado = JSON.parse(localStorage.getItem("user"));
  programa: string;

  _id: String;
  titulo: String;
  funciones: String;
  descripcion: String;
  empresaSelcted: any;
  ubicacion: String;
  modalidad: String;
  cantidad: Number;
  pagada: String;
  estado: String;

  constructor(private router: Router, 
              private _vacantesService: VacantesService, 
              private _convenioService: ConvenioService) { }

  ngOnInit(): void {this.getConvenio();}

  getConvenio(){
    this._convenioService.getConvenioEncargado(this.encargado._id).subscribe((resp:any)=>{
      this.convenio = resp.convenio;
      this._vacantesService.getVacantesEncargado(this.convenio._id).subscribe((resp: any) => {
        this.vacantes = resp.vacantes;
      }); 
    })
  }

  postVacante(form: NgForm) {
    Swal.fire({
      title: '¿Guardar Vacante?',
      icon: 'warning',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si',

      showCancelButton: true,
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33'

    }).then((result) => {
      if (result.value) {
        let vacante = new Vacante(
          form.value.titulo,
          form.value.funciones,
          form.value.descripcion,
          this.convenio._id,
          form.value.ubicacion,
          form.value.modalidad,
          form.value.cantidad,
          form.value.pagada
        );
        this._vacantesService.postVacantes(vacante).subscribe();
      }
    })

  }

  getDataPut(dato: any) {
    this._id = dato._id
    this.titulo = dato.titulo;
    this.funciones = dato.funciones;
    this.descripcion = dato.descripcion;
    this.empresaSelcted = dato.convenio.empresa.nombre;
    this.ubicacion = dato.ubicacion;
    this.modalidad = dato.modalidad;
    this.cantidad = dato.cantidad;
    this.pagada = dato.pagada;
    this.estado = dato.estado;
  }

  putVacante(form: NgForm) {
    Swal.fire({
      title: '¿Actualizar Vacante?',
      icon: 'warning',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si',

      showCancelButton: true,
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33'

    }).then((result) => {
      if (result.value) {

        let vacante = new Vacante(
          form.value.titulo,
          form.value.funciones,
          form.value.descripcion,
          this.convenio._id,
          form.value.ubicacion,
          form.value.modalidad,
          form.value.cantidad,
          form.value.pagada,
          form.value.estado
        );

        this._vacantesService.putVacante(this._id, vacante).subscribe();
      }
    })
  }

  deleteVacante(dato: any) {

    Swal.fire({
      title: '¿Eliminar vacante?',
      icon: 'warning',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si',

      showCancelButton: true,
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33'

    }).then((result) => {
      if (result.value) {
        this._vacantesService.eliminarVacante(dato._id).subscribe();
      }
    })
  }



}
