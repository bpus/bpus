import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { PasantiService } from 'src/app/services/pasantia/pasanti.service';

@Injectable({
  providedIn: 'root'
})
export class PropuestaPasantiaGuard implements CanActivate {
  constructor (private _pasantiaService:PasantiService, private router:Router) {}

    async canActivate () {
      const user = JSON.parse(localStorage.getItem('user'));
      const resp:any = await this._pasantiaService.getPasantia(user.modalidad).toPromise();
      const pasantia = resp.pasantia;
      if((pasantia.estado ==='PreInscrita' && pasantia.aprobacionEmpresa === true) || pasantia.estado_propuesta === "Ajustar"){
        return true;
      }else{
        this.router.navigate(["/"]);
      }
    }
}