import { Component, OnInit } from '@angular/core';
import { LineaInvestigacionService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lineas-jefe',
  templateUrl: './lineas-jefe.component.html',
  styles: [
  ]
})
export class LineasJefeComponent implements OnInit {

  user = JSON.parse(localStorage.getItem("user"));
  lineas: any = [];
  nombreLinea:string = '';
  nombreLineaEdit = '';
  lineaSelected:any;

  constructor(private _lineaService: LineaInvestigacionService) { }

  ngOnInit(): void {
    this.getLineas();
  }

  async getLineas(){
    this.lineas = await this._lineaService.getlineasJefe(this.user.programa).toPromise();
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
        const linea = {nombre: this.nombreLinea, programa: this.user.programa};
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
              timerProgressBar: true,
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
        const linea = {nombre: this.nombreLineaEdit};
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
              timer:1300,
              timerProgressBar: true,
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
    if(estado){
      txt = "Activar"
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
              title: "Línea editada correctamente",
              icon: "success",
              showCancelButton: false,
              showConfirmButton:false,
              showCloseButton:false,
              allowEnterKey: false,
              allowEscapeKey:false,
              allowOutsideClick: false,
              timer:1300,
              timerProgressBar: true,
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
            timer:1300,
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
