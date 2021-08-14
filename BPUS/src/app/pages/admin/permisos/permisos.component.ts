import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {PermisosService, RolesService} from 'src/app/services/service.index'
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-permisos',
  templateUrl: './permisos.component.html'
})
export class PermisosComponent implements OnInit {
  
  user = JSON.parse(localStorage.getItem("user"));
  roles:any;
  permisos:any;
  
  permiso_roles = [];
  permiso_roles_ids = [];

  permisoSelected:any;
  new_nombre:string = '';
  new_pagina:string = '';
  new_permiso_roles = [];
  new_permiso_roles_ids = [];
  isEqual:boolean = true;

  constructor(private route: ActivatedRoute, 
    private _permisosService: PermisosService,
    private _rolService: RolesService) { }

  ngOnInit(): void {
    this.getPermisos();
    this.getRoles();
  }

  permisoRolesAdd(){
    const selectRol = (document.getElementById("permiso_roles")) as HTMLSelectElement;
    const selectedIndex = selectRol.selectedIndex;
    if(selectedIndex > 0){
      function check(rol:any) {
        return rol._id == this.roles[selectedIndex-1]._id;
      }
      if(this.permiso_roles.length > 0){
        const yaestaahi = this.permiso_roles.find(check, this);
        if(typeof(yaestaahi) === "undefined"){
          const new_permiso_rol = this.roles[selectedIndex-1];
          this.permiso_roles.push(new_permiso_rol);
          this.permiso_roles_ids.push(new_permiso_rol._id);
        } 
      }else{
        const new_permiso_rol = this.roles[selectedIndex-1];
        this.permiso_roles.push(new_permiso_rol);
        this.permiso_roles_ids.push(new_permiso_rol._id);
      }
    }
  }

  permisoRolesRemove(index: number){
    this.permiso_roles.splice(index, 1);
    this.permiso_roles_ids.splice(index, 1);
  }

  permisoRolesEditRemove(index: number){
    this.new_permiso_roles.splice(index, 1);
    this.new_permiso_roles_ids.splice(index, 1);
    if(this.new_permiso_roles.length === this.permisoSelected.roles.length){
      for(let i = 0; i < this.new_permiso_roles.length; i++){
        if(this.new_permiso_roles[i]._id == this.permisoSelected.roles[i]._id){
          this.isEqual = false;
        }
      }
    }else{
      this.isEqual = false;
    } 
  }

  clearDataAdd(){
    this.permiso_roles = [];
    this.permiso_roles_ids = [];
  }

  clearDataEdit(){
    this.isEqual = true;
    this.permisoSelected = undefined;
    this.new_nombre = "";
    this.new_pagina = "";
    this.new_permiso_roles = [];
    this.new_permiso_roles_ids = [];
  }

  getPermisos(){
    this._permisosService.getPermisos().subscribe((resp:any)=>{
      this.permisos = resp.permisos;
    });
  }

  getRoles(){
    this._rolService.getRoles().subscribe((resp:any) => {
      this.roles = resp.roles;
    });
  }

  getPermisoSelected(permiso:any){
    this.permisoSelected = permiso;
    this.new_nombre = this.permisoSelected.nombre;
    this.new_pagina = this.permisoSelected.pagina;
    this.new_permiso_roles = this.new_permiso_roles.concat(this.permisoSelected.roles);
    this.new_permiso_roles.forEach(rol => {
      this.new_permiso_roles_ids.push(rol._id);
    })
  }

  permisoEditAddRol(){
    const selectRol = (document.getElementById("permiso_roles_edit")) as HTMLSelectElement;
    const selectedIndex = selectRol.selectedIndex;
    const new_permiso_rol = this.roles[selectedIndex-1];
    if(selectedIndex > 0){
      let rol_has_permiso = false;
      for(let rol of this.new_permiso_roles){
        if(rol._id == new_permiso_rol._id){
          rol_has_permiso = true;
        }
      }
      if(rol_has_permiso !== true){
        this.new_permiso_roles.push(new_permiso_rol);
        this.new_permiso_roles_ids.push(new_permiso_rol._id);
      }
    }
    if(this.new_permiso_roles.length === this.permisoSelected.roles.length){
      for(let i = 0; i < this.new_permiso_roles.length; i++){
        if(this.new_permiso_roles[i]._id == this.permisoSelected.roles[i]._id){
          this.isEqual = false;
        }
      }
    }else{
      this.isEqual = false;
    } 
  }

  postPermiso(f: NgForm){
    const permiso = {nombre: f.value.nombre, pagina: f.value.pagina, roles: this.permiso_roles_ids };
    Swal.fire({
      title: 'Crear Permiso?',
      icon: 'question',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si',
      showCancelButton: true,
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if(result.value){
        this._permisosService.postPermiso(permiso).subscribe((resp:any) => {
          Swal.close();
          Swal.fire({
            title: 'Permiso creado exitosamente!',
            icon: 'success',
            timer: 1000,
            showCancelButton: false,
            showConfirmButton: false
          }).then((result) => {
            const btnCancelarAdd = (document.getElementById("btnCancelarAdd")) as HTMLButtonElement;
            if(result){
              btnCancelarAdd.click();
              this.getPermisos();
            }else{
              btnCancelarAdd.click();
              this.getPermisos(); 
            }
          });
        });
      }
    });
  }

  putPermiso(){
    const permiso = {_id: this.permisoSelected._id, nombre: this.new_nombre, pagina: this.new_pagina, roles: this.new_permiso_roles_ids };
    Swal.fire({
      title: 'Editar Permiso?',
      icon: 'question',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si',
      showCancelButton: true,
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if(result.value){
        this._permisosService.putPermiso(permiso).subscribe((resp:any) => {
          Swal.close();
          Swal.fire({
            title: 'Permiso editado exitosamente!',
            icon: 'success',
            timer: 1000,
            showCancelButton: false,
            showConfirmButton: false
          }).then((result) => {
            const btnCancelarEdit = (document.getElementById("btnCancelarEdit")) as HTMLButtonElement;
            if(result){
              btnCancelarEdit.click();
              this.getPermisos();
            }else{
              btnCancelarEdit.click();
              this.getPermisos(); 
            }
          });
        });
      }
    });
  }

  getDataBuscar(data:string){

  }

  async deletePermiso(id:string){
    let check = await Swal.fire({
      title:"Eliminar permiso?",
      html: "<b>Esta operacion no se puede deshacer!!</b><br>"+
            "<label class='mt-2'>Escribe tu identificación:<label>",
      icon: "warning",
      showCancelButton: true,
      showConfirmButton:true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33',
      showCloseButton:false,
      input: "text",
      inputPlaceholder: 'Identificación',
      inputAttributes: {
        maxlength: "10",
        minlength: "8",
        onkeypress: "return (event.charCode >= 48 && event.charCode <= 57)",
        onCopy: "return false", 
        onDrag: "return false",
        onDrop: "return false",
        onPaste: "return false"
      },
      inputValidator: (value) => {
        if (!value) {
          return 'Tienes que escribir algo!'
        }else if(value !== this.user.identificacion){
          return 'No coincide tu identificación'
        }
      }
    });
    if (check.value == this.user.identificacion) {
      this._permisosService.deletePermiso(id).subscribe((resp:any)=>{
        if(resp){
          Swal.fire({
            title: "Eliminado correctamente",
            icon: "success",
            showCancelButton: false,
            showConfirmButton:false,
            showCloseButton:false,
            allowEnterKey: false,
            allowEscapeKey:false,
            allowOutsideClick: false,
            timer:1000,
            timerProgressBar: true,
          }).then((result) => {
            if(result.value){
              this.getPermisos();
            }else{
              this.getPermisos();
            }
          });
        }
      });  
    }
  }

}
