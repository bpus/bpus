import { Component, OnInit } from '@angular/core';
import { PasantiService, NotificacionesService } from 'src/app/services/service.index';
import { Router } from '@angular/router';

@Component({
  selector: 'app-re-pasantia',
  templateUrl: './re-pasantia-main.component.html'
})
export class RePasantiaComponent implements OnInit {

  info = JSON.parse(localStorage.getItem('user'));
  pasantia:any;

  constructor(private _pasantiaService: PasantiService, private router:Router) { }

  ngOnInit(): void {
    this.getPasantia();
  }

  getPasantia() {
    this._pasantiaService.getPasantia(this.info.modalidad).subscribe((resp: any) => {
      this.pasantia = resp.pasantia;
      if(!this.pasantia){
        this.router.navigate(["/login"]);
      }else{
        if(this.pasantia.estado !== 'Ajustar' && this.pasantia.aprobacionEmpresa !== false){
          this.router.navigate(['/']);
        }
      }
    });
  }

}
