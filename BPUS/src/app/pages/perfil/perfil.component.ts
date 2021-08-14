import { Component, OnInit } from '@angular/core';
import { ProgramaService, AdministrativoService, EstudianteService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  // Creamos variables globales
  usuario = JSON.parse(localStorage.getItem('user'));
  programa: any;
  telefono = "";
  telValid: boolean = false;

  // Inyectamos el servicio
  constructor(
    private _programaService: ProgramaService,
    private _adminService: AdministrativoService,
    private _estudianteService: EstudianteService
    ) {}

  ngOnInit() {
    if(this.usuario.telefono){
      this.telefono = this.usuario.telefono;
      (document.getElementById("telForm") as HTMLDivElement).setAttribute("class", "collapse show");
    }
    this.getProgramaInfo();
  }

  getProgramaInfo() {
    this._programaService.getPrograma().subscribe((resp) => {
      let infoPrograma = resp['programa'];
      this.programa = infoPrograma;
    });
  }

  showEditTelefono(){
    (document.getElementById("btnEdit") as HTMLDivElement).setAttribute("style", "display: block;");
    (document.getElementById("telForm") as HTMLDivElement).setAttribute("class", "collapse show");
    const telEdit = document.getElementById("telEdit") as HTMLInputElement;
    telEdit.readOnly = false;
    telEdit.setAttribute("style", "border: 1px solid #80bdff;; padding: 5px; border-radius: 5px;");
  }

  editTelefono(telEdit:HTMLInputElement){
    telEdit.value = telEdit.value.replace(/\D/g, "");
    if(telEdit.value.length === 10 && this.telefono !== this.usuario.telefono){
      this.telValid = true
    }else{
      this.telValid = false;
    }
  }

  cancelEdit(){
    const defaulStyle = "align-self: center; border: none; color: #455a64; font-family: 'Montserrat', sans-serif; font-weight: 400; width: 110px;";
    if(!this.usuario.telefono){
      (document.getElementById("telForm") as HTMLDivElement).setAttribute("class", "collapse");
      this.telefono = "";
    }else{
      this.telefono = this.usuario.telefono;
    }
    (document.getElementById("btnEdit") as HTMLDivElement).setAttribute("style", "display: none;");
    const telEdit = document.getElementById("telEdit") as HTMLInputElement;
    telEdit.readOnly = true;
    telEdit.setAttribute("style", defaulStyle);
    this.telValid = false;
  }

  putTelefono(){
    Swal.fire({
      title: "¿Editar teléfono?",
      icon: "question",
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si',
      showCancelButton: true,
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33'
    }).then(async(result) => {
      if(result){
        const usuario = Object.freeze({ usuario: this.usuario._id, telefono : this.telefono});
        let resp:any;
        if(this.usuario.codigo){
          resp = await this._estudianteService.putTelefono(usuario).toPromise();
        }else{
          resp = await this._adminService.putTelefono(usuario).toPromise();
        }
        if(resp){
          Swal.fire({
            title: "Editado correctamente",
            icon: "success",
            showCancelButton: false,
            showConfirmButton:false,
            showCloseButton:false,
            allowEnterKey: false,
            allowEscapeKey:false,
            allowOutsideClick: false,
            timer:1500,
            timerProgressBar: false,
          }).then(() => {
            localStorage.removeItem("user");
            this.usuario.telefono = this.telefono;
            localStorage.setItem("user", JSON.stringify(this.usuario));
            this.cancelEdit();
          });
        }else{
          Swal.fire({
            title: "Error al editar el teléfono",
            icon: "error",
            showCancelButton: false,
            showConfirmButton:false,
            showCloseButton:false,
            allowEnterKey: false,
            allowEscapeKey:false,
            allowOutsideClick: false,
            timer:1500,
            timerProgressBar: false,
          }).then(() => {
            this.cancelEdit();
          });
        }
      }
    });
  }

}
