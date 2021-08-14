import { Component, OnInit } from '@angular/core';
import { LineaInvestigacionService, ProgramaService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-lineas',
  templateUrl: './admin-lineas.component.html',
  styles: [
  ]
})
export class AdminLineasComponent implements OnInit {
  user = JSON.parse(localStorage.getItem("user"));
  lineas: any = [];
  programas: any = [];
  nombreLinea:string = '';
  nombreLineaEdit = '';
  programaAdd:string = '';
  programaEdit = '';
  lineaSelected:any;
  editValid = false;
  editDiferent = false;

  constructor(private _lineaService: LineaInvestigacionService, private  _programaService: ProgramaService) { }

  ngOnInit(): void {
    this.getLineas();
    this.getProgramas();
  }

  async getProgramas(){
    this.programas = await this._programaService.getTodosProgramas().toPromise();
  }

  async getLineas(){
    this.lineas = await this._lineaService.getlineasTodas().toPromise();
  }

  postLinea(){
    Swal.fire({
      title: "Crear línea de investigación?",
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
        const linea = {nombre: this.nombreLinea, programa: this.programaAdd};
        this.resetNombre();
        (document.getElementById("btnCancelarAdd") as HTMLButtonElement).click();
        this._lineaService.postlinea(linea).subscribe((resp:any)=>{
          if(resp){
            Swal.fire({
              title: "Línea creada correctamente",
              icon: "success",
              showCancelButton: false,
              showConfirmButton:false,
              showCloseButton:false,
              allowEnterKey: false,
              allowEscapeKey:false,
              allowOutsideClick: false,
              timer:1000,
              timerProgressBar: false,
            }).then(() => {
              this.getLineas();
            });
          }
        });
      }
    });
  }

  resetNombre(){
    this.nombreLinea = "";
  }

  getLineaSelected(linea:any){
    this.nombreLineaEdit = linea.nombre;
    this.lineaSelected = linea;
    this.programaEdit = linea.programa._id;
  }

  checkEdit(){
    if(this.nombreLineaEdit !== '' && this.programaEdit !== ''){
      this.editValid = true;
    }else{
      this.editValid = false;
    }
    if(this.nombreLineaEdit !== this.lineaSelected?.nombre || this.programaEdit !== this.lineaSelected?.programa._id){
      this.editDiferent = true;
    }else{
      this.editDiferent = false;
    }
  }

  putLinea(){
    Swal.fire({
      title: "Editar línea de investigación?",
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
        const linea = {nombre: this.nombreLineaEdit, programa: this.programaEdit};
        (document.getElementById("btnCancelarEdit") as HTMLButtonElement).click();
        this._lineaService.putlinea(this.lineaSelected._id, linea).subscribe((resp:any)=>{
          if(resp){
            Swal.fire({
              title: "Línea editada correctamente",
              icon: "success",
              showCancelButton: false,
              showConfirmButton:false,
              showCloseButton:false,
              allowEnterKey: false,
              allowEscapeKey:false,
              allowOutsideClick: false,
              timer:1000,
              timerProgressBar: false,
            }).then(() => {
              this.getLineas();
            });
          }
        });
      }
    });
  }

  cambiarEstadoLinea(id:string, estado:boolean){
    let txt = "Desactivar";
    let txtResult = "Desactivada";
    if(estado){
      txt = "Activar";
      txtResult = "activada"
    }
    Swal.fire({
      title: txt+" línea de investigación?",
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
        const linea = {estado: estado};
        this._lineaService.putlinea(id, linea).subscribe((resp:any)=>{
          if(resp){
            Swal.fire({
              title: "Línea "+txtResult+" correctamente",
              icon: "success",
              iconHtml: "",
              showCancelButton: false,
              showConfirmButton:false,
              showCloseButton:false,
              allowEnterKey: false,
              allowEscapeKey:false,
              allowOutsideClick: false,
              timer:1000,
              timerProgressBar: false,
            }).then(() => {
              this.getLineas();
            });
          }
        });
      }
    });
  }

  async deleteLinea(id:string){
    let check = await Swal.fire({
      title:"Eliminar línea de investigación?",
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
      this._lineaService.deletelinea(id).subscribe((resp:any)=>{
        if(resp){
          Swal.fire({
            title: "línea eliminada correctamente",
            icon: "success",
            showCancelButton: false,
            showConfirmButton:false,
            showCloseButton:false,
            allowEnterKey: false,
            allowEscapeKey:false,
            allowOutsideClick: false,
            timer:1000,
            timerProgressBar: false,
          }).then((result) => {
            if(result){
              this.getLineas();
            }else{
              this.getLineas();
            }
          });
        }
      });
    }
  }

}
