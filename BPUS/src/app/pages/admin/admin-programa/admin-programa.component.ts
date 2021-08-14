import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProgramaService, AdministrativoService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-programa',
  templateUrl: './admin-programa.component.html'
})
export class AdminProgramaComponent implements OnInit {

  programas:any;
  programaSelected:any;
  nombreJefeSelected:string;
  docentes:any
  user = JSON.parse(localStorage.getItem("user"));
  jefeAdd:string;
  jefeEdit:string
  jefeAddValid = false;

  editValid = false;
  editChange = false;

  desde: number = 0;
  pagina:number = 1;
  totalpaginas:number = 0

  constructor(private _adminService:AdministrativoService, private _programaService:ProgramaService) { }

  ngOnInit(): void {
    this.getProgramas();
    this.getDocentes();
  }

  getProgramas(){
    this._programaService.getProgramas(this.desde).subscribe((resp:any)=>{
      this.programas = resp;
      this.totalpaginas = Math.ceil(this._programaService.totalprogramas/10);
    })
  }

  getDocentes(){
    this._adminService.getDocentes().subscribe((resp:any)=>{
      this.docentes = resp.docentes;
      for(let i= 0; i < this.docentes.length; i++){
        this.docentes[i].nombres = this.docentes[i].nombres+" "+this.docentes[i].apellidos;  
      }
    });
  }

  checkJefe(){
    const jefe = (document.getElementById("jefe") as HTMLSelectElement).value;
    let isInDocentes = false;
    for(let i= 0; i < this.docentes.length; i++){
      if(jefe === this.docentes[i].nombres){
        isInDocentes = true;
        this.jefeAdd = this.docentes[i]._id;
      }
    }
    if(isInDocentes){
      this.jefeAddValid = true;
    }else{
      this,this.jefeAddValid = false;
    }
  }

  checkEdit(){
    const nombreEdit = document.getElementById("nombreEdit") as HTMLInputElement;
    const cred_totales_edit = document.getElementById("cred_totales_edit") as HTMLInputElement;
    const jefeEdit = document.getElementById("jefeEdit") as HTMLInputElement;
    cred_totales_edit.value = cred_totales_edit.value.replace(/\D/g, "");
    let isInDocentes = false;
    for(let i= 0; i < this.docentes.length; i++){
      if(jefeEdit.value === this.docentes[i].nombres){
        isInDocentes = true;
        this.jefeEdit = this.docentes[i]._id;
      }
    }
    if(
      isInDocentes && nombreEdit.value !== "" && parseInt(cred_totales_edit.value) > 50 && parseInt(cred_totales_edit.value) < 250){
      this.editValid = true;
    }else{
      this.editValid = false;
    }
    if((isInDocentes && jefeEdit.value !== this.nombreJefeSelected) || nombreEdit.value !== this.programaSelected.nombre || parseInt(cred_totales_edit.value) !== this.programaSelected.creditos_totales){
      this.editChange = true;
    }else{
      this.editChange = false;
    }
  }

  postPrograma(f:NgForm){
    Swal.fire({
      title: "Agregar programa?",
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
    }).then(async(result) => {
      if(result.value){
        const programa = {nombre: f.value.nombre, creditos_totales: f.value.creditos_totales, jefe: this.jefeAdd};
        (document.getElementById("btnCancelarAdd") as HTMLButtonElement).click();
        let resp = await this._programaService.postPrograma(programa).toPromise();
        if(resp){
          Swal.fire({
            title: "Programa agregado correctamente",
            icon: "success",
            showCancelButton: false,
            showConfirmButton:false,
            showCloseButton:false,
            allowEnterKey: false,
            allowEscapeKey:false,
            allowOutsideClick: false,
            timer:1300,
            timerProgressBar: false,
          }).then(() => {
            this.desde = 0;
            this.pagina = 1;
            this.totalpaginas = 0
            this.getProgramas();
          });
        }
      }
    });
  }

  putPrograma(){
    Swal.fire({
      title: "Editar programa?",
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
    }).then(async(result) => {
      if(result.value){
        const nombreEdit = (document.getElementById("nombreEdit") as HTMLInputElement).value;
        const cred_totales_edit = (document.getElementById("cred_totales_edit") as HTMLInputElement).value;
        const programa = {nombre: nombreEdit, creditos_totales: cred_totales_edit, jefe: this.jefeEdit};
        (document.getElementById("btnCancelarEdit") as HTMLButtonElement).click();
        let resp = await this._programaService.putPrograma(this.programaSelected._id, programa).toPromise();
        if(resp){
          Swal.fire({
            title: "Programa editado correctamente",
            icon: "success",
            showCancelButton: false,
            showConfirmButton:false,
            showCloseButton:false,
            allowEnterKey: false,
            allowEscapeKey:false,
            allowOutsideClick: false,
            timer:1300,
            timerProgressBar: false,
          }).then(() => {
            this.desde = 0;
            this.pagina = 1;
            this.totalpaginas = 0
            this.getProgramas();
          });
        }
      }
    });
  }

  async deletePrograma(programa:any){
    let check = await Swal.fire({
      title:"Eliminar el programa de "+programa.nombre+" ?",
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
          return 'No coincide con la identificación'
        }
      }
    });
    if (check.value == this.user.identificacion) {
      this._programaService.deletePrograma(programa._id).subscribe(async(resp:any)=>{
        if(resp){
          Swal.fire({
            title: "Programa eliminado correctamente",
            icon: "success",
            showCancelButton: false,
            showConfirmButton:false,
            showCloseButton:false,
            allowEnterKey: false,
            allowEscapeKey:false,
            allowOutsideClick: false,
            timer:1300,
            timerProgressBar: false,
          }).then(() => {
            this.desde = 0;
            this.pagina = 1;
            this.totalpaginas = 0
            this.getProgramas();
          });
        }
      });  
    }
  }

  cambiarDesde(valor:number){

    let desde = this.desde + valor;
  
    if (desde >= this._programaService.totalprogramas) {
      return;
    }
    if (desde <0 ) {
      return;
    }
    this.desde += valor;
    this.pagina = (this.desde/10)+1;
    this.getProgramas();
  }

  cambiarDesdeInput(valor:number){
    this.desde = (valor-1)*10;
    if(valor > this.totalpaginas){
      const inputPagina = (document.getElementById('pagina')) as HTMLInputElement;
      inputPagina.value = this.pagina.toString();
      return;
    }
    if (this.desde >= this._programaService.totalprogramas) {
      return;
    }
    if (this.desde <0 ) {
      return;
    }
    this.pagina = (this.desde/10)+1;
    this.getProgramas();
  }

  getProgramaSelected(dato:any){
    this.programaSelected = dato;
    this.editChange = false;
    this.editValid = false;
    if(this.programaSelected.jefe){
      this.nombreJefeSelected = this.programaSelected.jefe.nombres+" "+this.programaSelected.jefe.apellidos;
    }else{
      this.nombreJefeSelected = "";
    }
    const nombreEdit = document.getElementById("nombreEdit") as HTMLInputElement;
    nombreEdit.value = this.programaSelected.nombre;
    nombreEdit.placeholder = this.programaSelected.nombre;
    const cred_totales_edit = document.getElementById("cred_totales_edit") as HTMLInputElement;
    cred_totales_edit.value = this.programaSelected.creditos_totales;
    cred_totales_edit.placeholder = this.programaSelected.creditos_totales;
    const jefeEdit = document.getElementById("jefeEdit") as HTMLInputElement;
    jefeEdit.placeholder = this.nombreJefeSelected;
  }

}
