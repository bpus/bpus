import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Empresa } from 'src/app/models/Empresa.model';
import { EmpresaService, BusquedaService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-empresas',
  templateUrl: './admin-empresas.component.html'
})
export class AdminEmpresasComponent implements OnInit {

  empresas: any[];
  usuario = JSON.parse(localStorage.getItem('user'));

  _id: string;
  convienioId: string;
  nit: string;
  nombre: string;
  ciudad:string;
  direccion: string;
  telefono: string;
  naturaleza: string;
  actividad_economica: string;
  estado: string;

  constructor(private _busquedaService: BusquedaService, private _empresaService: EmpresaService,) { }

  ngOnInit(): void {
    this.getEmpresas();
  }

  async getEmpresas(){
    let resp:any = await this._empresaService.getEmpresas().toPromise();
    this.empresas = resp.empresas;
  }


  postEmpresa(form: NgForm) {
    Swal.fire({
      title: '¿Guardar Empresa?',
      icon: 'warning',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si',
      showCancelButton: true,
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33'

    }).then((result) => {
      if (result.value) {
        
        let empresa = new Empresa(
            form.value.nit,
            form.value.nombre,
            form.value.ciudad,
            form.value.direccion,
            form.value.telEmpresa,
            form.value.naturaleza,
            form.value.actividadEc,
          );

        this._empresaService.postEmpresa(empresa).subscribe((resp:any) => {
          Swal.fire({
            title:"Empresa creada correctamente",
            icon: "success",
            allowEnterKey: false,
            allowEscapeKey:false,
            allowOutsideClick: false,
            showCloseButton:false,
            showConfirmButton:false,
            showCancelButton:false,
            timer: 1300,
            timerProgressBar:false
          }).then(() => {
            (document.getElementById("btnCerrarAdd") as HTMLButtonElement).click();
            this.getEmpresas();
          }); 
        }); 
      }
    });
  }


  getDataPut(dato: any) {
    this._id = dato._id
    this.nit = dato.nit
    this.nombre = dato.nombre;
    this.ciudad = dato.ciudad
    this.direccion = dato.direccion;
    this.telefono = dato.telefono;
    this.naturaleza = dato.naturaleza;
    this.actividad_economica = dato.actividad_economica;
    this.estado = dato.estado;
  }

  putEmpresa(form: NgForm) {
    Swal.fire({
      title: '¿Actualizar Empresa?',
      icon: 'warning',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si',

      showCancelButton: true,
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33'

    }).then((result) => {
      if (result.value) {

        let empresa = new Empresa(
          this.nit,
          form.value.nombre,
          form.value.ciudad,
          form.value.direccion,
          form.value.telEmpresa,
          form.value.naturaleza,
          form.value.actividadEc,
          form.value.estado
        );

        this._empresaService.putEmpresa(this._id, empresa).subscribe((resp:any) => {
            Swal.fire({
              title:"Empresa editada correctamente",
              icon: "success",
              allowEnterKey: false,
              allowEscapeKey:false,
              allowOutsideClick: false,
              showCloseButton:false,
              showConfirmButton:false,
              showCancelButton:false,
              timer: 1300,
              timerProgressBar:false
            }).then(() => {
              (document.getElementById("btnCerraEdit") as HTMLButtonElement).click();
              this.getEmpresas();
            }); 
        });
      }
    })
  }

  deleteEmpresa(dato: any) {
    Swal.fire({
      title: '¿Eliminar Empresa?',
      icon: 'warning',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si',
      showCancelButton: true,
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.value) {
        this._empresaService.deleteEmpresa(dato._id).subscribe();
      }
    });
  }

  buscarEmpresa(data:string){
    if(data){
      this._busquedaService.buscar('empresa', data).subscribe((resp:any) => {
        this.empresas = resp.empresa;
      });
    }else{
      this.getEmpresas();
    }
  }

}
