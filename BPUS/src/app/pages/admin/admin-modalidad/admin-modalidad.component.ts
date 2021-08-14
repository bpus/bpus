import { Component, OnInit } from '@angular/core';
import { ModalidadService } from 'src/app/services/service.index';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-modalidad',
  templateUrl: './admin-modalidad.component.html'
})
export class AdminModalidadComponent implements OnInit {

  modalidades: any;
  modalidadSelected:any
  user = JSON.parse(localStorage.getItem("user"));
  porcentajeAddValid = false;
  porcentajeAddValidEdit = false;
  nombreEditValid = false;
  urlEditValid = false;
  editValid = false;

  constructor(private _modalidadesService: ModalidadService) { }

  ngOnInit(): void {
    this.getModalidades();
  }

  getModalidades() {
    this._modalidadesService.getModalidades().subscribe((resp: any) => {
      this.modalidades = resp.modalidades;
    });
  }

  postModalidad(f:NgForm){
    Swal.fire({
      title: "Crear modalidad?",
      icon: "question",
      showCancelButton: true,
      showConfirmButton:true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33',
      showCloseButton:false,
      allowEnterKey: false,
      allowEscapeKey:false,
      allowOutsideClick: false,
    }).then((result) => {
      if(result.value){
        let porcentaje_creditos = parseInt(f.value.porcentaje_creditos);
        porcentaje_creditos = porcentaje_creditos/100;
        const modalidad = {nombre: f.value.nombre, porcentaje_creditos:porcentaje_creditos, url: "/"+f.value.url};
        this._modalidadesService.postModalidad(modalidad).subscribe((resp:any)=>{
          if(resp){
            Swal.fire({
              title: "Modalidad creada correctamente",
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
              const btnCancelarAdd = (document.getElementById("btnCancelarAdd")) as HTMLButtonElement;
              if(result.value){
                btnCancelarAdd.click()
                this.getModalidades();
              }else{
                btnCancelarAdd.click();
                this.getModalidades();
              }
            })
          }
        });
      }
    });
  }

  putModalidad(f:NgForm){
    Swal.fire({
      title: "Editar modalidad?",
      icon: "question",
      showCancelButton: true,
      showConfirmButton:true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33',
      showCloseButton:false,
      allowEnterKey: false,
      allowEscapeKey:false,
      allowOutsideClick: false,
    }).then((result) => {
      if(result.value){
        let porcentaje_creditos = parseInt(f.value.porcentaje_creditos);
        porcentaje_creditos = porcentaje_creditos/100;
        const modalidad = {_id: this.modalidadSelected._id, nombre: f.value.nombre, porcentaje_creditos: porcentaje_creditos, url: "/"+f.value.url};
        this._modalidadesService.putModalidad(modalidad).subscribe((resp:any)=>{
          if(resp){
            Swal.close();
            Swal.fire({
              title: "Modalidad editada correctamente",
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
              const btnCancelarEdit = (document.getElementById("btnCancelarEdit")) as HTMLButtonElement;
              if(result.value){
                btnCancelarEdit.click()
                this.getModalidades();
              }else{
                btnCancelarEdit.click();
                this.getModalidades();
              }
            });
          }
        });
      }
    });
  }

  async deleteModalidad(modalidad:any){
    let check = await Swal.fire({
      title:"Eliminar modalidad?",
      html: "<b>Esta operación no se puede deshacer!!</b><br>"+
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
          return 'No coincide con tu identificación'
        }
      }
    });
    if (check.value == this.user.identificacion) {
      this._modalidadesService.deleteModalidad(modalidad._id).subscribe((resp:any)=>{
        if(resp){
          Swal.fire({
            title: "Modalidad eliminada correctamente",
            icon: "success",
            showCancelButton: false,
            showConfirmButton:false,
            showCloseButton:false,
            allowEnterKey: false,
            allowEscapeKey:false,
            allowOutsideClick: false,
            timer:1300,
            timerProgressBar: false,
          }).then((result) => {
            if(result){
              this.getModalidades();
            }else{
              this.getModalidades();
            }
          });
        }
      });
    }
  }

  getModalidadSelected(modalidad:any){
    this.modalidadSelected = modalidad;
    this.nombreEditValid = false;
    this.porcentajeAddValidEdit = false;
    this.urlEditValid = false; 
    const porcentaje_creditosEdit = (document.getElementById("porcentaje_creditosEdit")) as HTMLInputElement;
    const nombreEdit = (document.getElementById("nombreEdit")) as HTMLInputElement;
    const urlEdit = (document.getElementById("urlEdit")) as HTMLInputElement;
    nombreEdit.placeholder = this.modalidadSelected.nombre;
    nombreEdit.value =this.modalidadSelected.nombre;
    urlEdit.placeholder = this.modalidadSelected.url.substring(1);
    urlEdit.value =this.modalidadSelected.url.substring(1);
    porcentaje_creditosEdit.placeholder = (this.modalidadSelected.porcentaje_creditos*100).toString();
    porcentaje_creditosEdit.value =(this.modalidadSelected.porcentaje_creditos*100).toFixed(0).toString();
  }

  checkNombreEdit(){
    const nombreEdit = (document.getElementById("nombreEdit")) as HTMLInputElement;
    if(nombreEdit.value !== this.modalidadSelected.nombre && nombreEdit.value !== ""){
      this.nombreEditValid = true;
    }else{
      this.nombreEditValid = false;
    }
  }

  checkUrlEdit(){
    const urlEdit = (document.getElementById("urlEdit")) as HTMLInputElement;
    if(urlEdit.value !== this.modalidadSelected.url.substring(1) && urlEdit.value !== ""){
      this.urlEditValid = true;
    }else{
      this.urlEditValid = false;
    }
  }

  checkPorcentaje(){
    const inputPorcentaje = (document.getElementById("porcentaje_creditos")) as HTMLInputElement;
    const porcentaje = parseInt(inputPorcentaje.value);
    if (porcentaje >= 50){
      this.porcentajeAddValid = true;
    }else{
      this.porcentajeAddValid = false;
    }
  }

  checkEdit(){
    const nombreEdit = (document.getElementById("nombreEdit")) as HTMLInputElement;
    const urlEdit = (document.getElementById("urlEdit")) as HTMLInputElement;
    const inputPorcentaje = (document.getElementById("porcentaje_creditosEdit")) as HTMLInputElement;
    const porcentaje = parseInt(inputPorcentaje.value);
    if(nombreEdit.value !== "" &&  urlEdit.value !== "" && porcentaje >= 50){
      this.editValid = true;
    }else{
      this.editValid = false;
    }
  }

  checkPorcentajeEdit(){
    const inputPorcentaje = (document.getElementById("porcentaje_creditosEdit")) as HTMLInputElement;
    const porcentaje = parseInt(inputPorcentaje.value);
    if (porcentaje >= 50){
      let modCreditos = this.modalidadSelected.porcentaje_creditos;
      modCreditos = modCreditos*100;
      modCreditos.toFixed(0);
      if (porcentaje !== modCreditos){
        this.porcentajeAddValidEdit = true;
      }else{
        this.porcentajeAddValidEdit = false;
      }
    }else{
      this.porcentajeAddValidEdit = false;
    }
  }

}
