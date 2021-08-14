import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class ModalidadGuard implements CanActivate {
  constructor (private router:Router, private _loginService:LoginService) {}

    canActivate () {
        const user = JSON.parse(localStorage.getItem('user'));
        if(user.codigo){
          if(user.modalidad){
            if(user.onModel === "Proyecto"){
              const entra = localStorage.getItem("NoEntre");
              if(entra){
                this.router.navigate(['/aceptar-proyecto']);
              }else{
                return true;
              }
            }else{
              return true;
            }
          }else{
            this._loginService.logout();
          }
        }else if(user){
          return true;
        }else{
          this._loginService.logout();
        }
    }
}