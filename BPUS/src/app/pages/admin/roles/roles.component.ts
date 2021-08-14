import { Component, OnInit } from '@angular/core';
import {RolesService} from 'src/app/services/service.index'
import { Router} from '@angular/router';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html'
})
export class RolesComponent implements OnInit {

  user = JSON.parse(localStorage.getItem("user"));
  roles:any;

  constructor(private router: Router, private _rolService: RolesService) { }

  ngOnInit(): void {
    this.getRoles();
  }

  getRoles(){
    this._rolService.getRoles().subscribe((resp:any) => {
      this.roles = resp.roles;
    });
  }

  postRol(form: NgForm){
    const rol = {nombre: form.value.nuevoRol.toUpperCase()};
    Swal.fire({
      title: 'Crear rol?',
      text:`Crearas el rol ${rol.nombre}, estás seguro?`,
      icon: 'question',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si',
      showCancelButton: true,
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33'
    }).then((result) => {
      const btnClose = (document.getElementById('btnClose')) as HTMLButtonElement;
      if (result.value) {
        btnClose.click();
        this._rolService.postRol(rol).subscribe((resp:any)=>{
          Swal.close();
          Swal.fire({
            title: 'Rol creado correctamente',
            icon: 'success',
            timer: 1000,
            showConfirmButton:false,
            timerProgressBar: true,
          }).then((result) => {
            if (result.dismiss) {
              this.getRoles();
            }
          });
        });
      }else {
        btnClose.click();
      }
    });
  }

}
