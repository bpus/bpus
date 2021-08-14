import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Empresa } from '../../../models/Empresa.model';
import { EncargadoEmpresa } from '../../../models/EncargadoEmpresa.model';
import { Convenio } from 'src/app/models/Convenio.model';
import Swal from 'sweetalert2';
import { EmpresaService } from 'src/app/services/service.index';
import { AdministrativoService } from 'src/app/services/service.index';
import { ConvenioService } from 'src/app/services/service.index';
import {Router} from '@angular/router';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html'
})

export class EmpresasComponent implements OnInit {

  convenios: any[];
  programa: string;
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
  nombres_persona: string;
  apellidos_persona: string;
  cedula: string;
  encargadoId:string
  cargo_persona: string;
  correo_persona: string;
  telefono_persona: string;
  estado: string;
  rutapdf: string;

  documento_convenio = new FormData();
  nombreArchivoC:string;

  documento_convenioUpdate = new FormData();
  nombreArchivoCUpdate:string;
  
  MAX_SIZE_FILE: number = 1000000

  constructor(private router: Router,
              private _empresaService: EmpresaService,
              private _adminService: AdministrativoService, 
              private _convenioService: ConvenioService) { }

  ngOnInit(): void {this.getConveniosJefe();}

  getConveniosJefe() {
    let programa = this.usuario.programa;
    this.programa = programa;

    this._convenioService.getConveniosPrograma(programa).subscribe((resp: any) => {
      this.convenios = resp.convenios;
    });
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

        let programa = this.usuario.programa._id;
        
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
          let encargadoEmpresa = new EncargadoEmpresa(
            form.value.cedula,
            form.value.nombres,
            form.value.apellidos,
            form.value.correo,
            form.value.telPersona,
            form.value.puesto,
            "60b66f2b5756933d5096d51a",
          )
          this._adminService.postEncargado(encargadoEmpresa).subscribe((respp:any) => {
            let convenio = new Convenio(programa,  resp._id, respp._id);
            this._convenioService.postConvenio(convenio).subscribe((anws:any) => {
              if(typeof(this.nombreArchivoC) !== 'undefined'){
                this._convenioService.postDocumentoConvenio(anws._id, this.documento_convenio).subscribe((ans:any) => {
                  if(ans){
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
                      (document.getElementById("btnCerraAdd") as HTMLButtonElement).click();
                      this.getConveniosJefe();
                    });
                  }
                });
              }else{
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
                  (document.getElementById("btnCerraAdd") as HTMLButtonElement).click();
                  this.getConveniosJefe();
                });
              }
            });
          });
        }); 
      }
    });
  }


  getDataPut(dato: any) {
    this.convienioId = dato._id;
    this._id = dato.empresa._id
    this.nit = dato.empresa.nit
    this.nombre = dato.empresa.nombre;
    this.ciudad = dato.empresa.ciudad
    this.direccion = dato.empresa.direccion;
    this.telefono = dato.empresa.telefono;
    this.naturaleza = dato.empresa.naturaleza;
    this.actividad_economica = dato.empresa.actividad_economica;
    this.nombres_persona = dato.encargado.nombres;
    this.apellidos_persona = dato.encargado.apellidos;
    this.cargo_persona = dato.encargado.cargo;
    this.correo_persona = dato.encargado.correo;
    this.cedula = dato.encargado.identificacion;
    this.encargadoId = dato.encargado._id;
    this.telefono_persona = dato.encargado.telefono;
    this.rutapdf = dato.rutapdf;
    this.estado = dato.empresa.estado;

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
          if(typeof(this.nombreArchivoCUpdate) !== 'undefined'){
            this._convenioService.postDocumentoConvenio(this.convienioId, this.documento_convenioUpdate).subscribe((respp:any) => {
              if(respp){
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
                  this.getConveniosJefe();
                });
              }
            });
          }else{
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
              this.getConveniosJefe();
            }); 
          }
        });
      }
    })
  }

  putEncargado(form: NgForm) {
    Swal.fire({
      title: 'Editar encargado?',
      icon: 'warning',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si',
      showCancelButton: true,
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.value) {
        let encargadoEmpresa = new EncargadoEmpresa(
          form.value.cedula,
          form.value.nombres,
          form.value.apellidos,
          form.value.correo,
          form.value.telPersona,
          form.value.puesto,
          "60b66f2b5756933d5096d51a",
        )
        this._adminService.putEncargado(this.encargadoId,encargadoEmpresa).subscribe((resp:any)=>{
          if(resp){
            Swal.fire({
              title:"Encargado editado correctamente",
              icon: "success",
              allowEnterKey: false,
              allowEscapeKey:false,
              allowOutsideClick: false,
              showCloseButton:false,
              showConfirmButton:false,
              showCancelButton:false,
              timer: 1300,
              timerProgressBar:false
            }).then(()=>{
              (document.getElementById("btnCerraEdit") as HTMLButtonElement).click();
              this.getConveniosJefe()
            });
          }
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
    })
  }

  getFileConvenio(file: File) {
    if (file.size > this.MAX_SIZE_FILE) {
      Swal.fire({
        title: '¡Lo Sentimos!',
        html: `<p> El archivo: <b>${file.name}</b>, supera el 1 MB</p>`,
        icon: 'error',
        confirmButtonText: 'Ok',
        showCancelButton: false,
        confirmButtonColor: '#60D89C',
      }).then(() => {
        location.reload()
      });
    } else {
      this.nombreArchivoC = file.name;
      let documento_convenio = <File>file;
      this.documento_convenio.append('documento_convenio', documento_convenio, documento_convenio.name);
    }
  }

  getFileConvenioUpdate(file: File) {
    if (file.size > this.MAX_SIZE_FILE) {
      Swal.fire({
        title: '¡Lo Sentimos!',
        html: `<p> El archivo: <b>${file.name}</b>, supera el 1 MB</p>`,
        icon: 'error',
        confirmButtonText: 'Ok',
        showCancelButton: false,
        confirmButtonColor: '#60D89C',
      }).then(() => {
        location.reload()
      });
    } else {
      this.nombreArchivoCUpdate = file.name;
      let documento_convenio = <File>file;
      this.documento_convenioUpdate.append('documento_convenio', documento_convenio, documento_convenio.name);
    }
  }

  clearDocumentoUpdate(){
    this.nombreArchivoCUpdate = undefined;
    this.documento_convenioUpdate = new FormData();
    var fileUpdate = (document.getElementById("nombreArchivoCUpdate")) as HTMLInputElement;
    fileUpdate.value = "";
  }

}








