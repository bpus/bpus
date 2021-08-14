import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BusquedaService, EstudianteService } from 'src/app/services/service.index';

@Component({
  selector: 'app-admin-estudiantes',
  templateUrl: './admin-estudiantes.component.html'
})
export class AdminEstudiantesComponent implements OnInit {

  user = JSON.parse(localStorage.getItem('user'));
  estudiantes:any;

  desde: number = 0;
  pagina:number = 1;
  totalpaginas:number = 0;

  nombreArchivoEst: string;
  documento_Est = new FormData();
  MAX_SIZE_FILE: number = 1000000

  constructor(private _busquedaService: BusquedaService, private _estudianteService:EstudianteService) { }

  ngOnInit(): void {
    this.getEstudiantes();
  }

  getEstudiantes(){
    this._estudianteService.getEstudiantes(this.user.programa, this.desde).subscribe((resp:any)=>{
      this.estudiantes = resp;
      this.totalpaginas = Math.ceil(this._estudianteService.totalEstudiantes/10);
    })
  }

  cambiarDesde(valor:number){

    let desde = this.desde + valor;
  
    if (desde >= this._estudianteService.totalEstudiantes) {
      return;
    }
    if (desde <0 ) {
      return;
    }
    this.desde += valor;
    this.pagina = (this.desde/10)+1;
    this.getEstudiantes();
  }

  cambiarDesdeInput(valor:number){
    this.desde = (valor-1)*10;
    if(valor > this.totalpaginas){
      const inputPagina = (document.getElementById('pagina')) as HTMLInputElement;
      inputPagina.value = this.pagina.toString();
      return;
    }
    if (this.desde >= this._estudianteService.totalEstudiantes) {
      return;
    }
    if (this.desde <0 ) {
      return;
    }
    this.pagina = (this.desde/10)+1;
    this.getEstudiantes();
  }

  getFileEst(file: File) {
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
      this.nombreArchivoEst = file.name;
      let documento_est= <File>file;
      this.documento_Est.append('documento_est', documento_est, documento_est.name);
    }
  }

  uploadEst(){
    this.clearModal();
    let btnClose = (document.getElementById('closeModal')) as HTMLElement;
    btnClose.click();
        Swal.fire({
          title: 'Por favor espera!',
          html: '<b></b>',
          allowEnterKey: false,
          allowEscapeKey: false,
          allowOutsideClick: false,
          showCancelButton: false,
          showCloseButton: false,
          showConfirmButton:false,
          timer: 1000*60*3,
          timerProgressBar: false,
          onOpen: async () => {
            Swal.showLoading();
            const content = Swal.getHtmlContainer();
            const b = content.querySelector('b');
            b.textContent = "Actualizando estudiantes";
            await this._estudianteService.postEstudiante(this.user.programa, this.documento_Est).toPromise();
            Swal.close();
          },
          onClose: () => {
            Swal.fire({
              title: '¡Bien Hecho!',
              text: 'Estudiantes actuliazadas correctamente',
              icon: 'success',
              timer: 1300,
              timerProgressBar: false,
              showConfirmButton:false,
              showCloseButton: false,
              showCancelButton: false,
              allowOutsideClick:false,
              allowEscapeKey:false,
              allowEnterKey:false,
            }).then(() => {
              this.getEstudiantes();
            });
          }
      }).then(() => {
        this.getEstudiantes();
      });
  }

  clearModal(){
    this.nombreArchivoEst = null;
    this.documento_Est = new FormData();
  }

  getDataBuscar(data:string) {
    if(data){
      this._busquedaService.buscarEstudiante('estudiante', data, this.user.programa).subscribe((resp:any)=>{
        this.estudiantes = resp.estudiante.usuarios;
        this.totalpaginas = Math.ceil(resp.estudiante.conteo/10);
      });
    }else{
      this.desde = 0;
      this.pagina = 1;
      this.getEstudiantes();
    }

  }

}
