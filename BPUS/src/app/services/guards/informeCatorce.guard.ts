import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { PasantiService } from 'src/app/services/pasantia/pasanti.service';

@Injectable({
  providedIn: 'root'
})
export class InformeCatorceGuard implements CanActivate {
  constructor (private _pasantiaService:PasantiService, private router:Router) {}

  async canActivate () {
    const user = JSON.parse(localStorage.getItem('user'));
    const resp:any = await this._pasantiaService.getPasantia(user.modalidad).toPromise();
    const pasantia = resp.pasantia;
    if(pasantia.fecha_actaInicio){
      let currentDate = new Date();
      let fechaInicio = new Date(Date.parse(pasantia.fecha_actaInicio));
      const diff = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate()) ) /(1000 * 60 * 60 * 24 * 7));
      if(diff < 14 || pasantia.estado !== 'En ejecución' || pasantia.estado_informe14){
        if(pasantia.estado_informe14 == "Ajustar"){
          return true;
        }else{
          this.router.navigate(["/"]);
        }
      }else{
        return true;
      }
    }else{
      this.router.navigate(["/"]);
    }  
  }
}