import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from 'src/app/services/login/login.service';

@Injectable()
export class VerificaTokenGuard implements CanActivate {

  constructor(private _loginService:LoginService){}

  canActivate(): Promise<boolean> | boolean {

    let token = this._loginService.token;
    let user = JSON.parse(localStorage.getItem("user"));
    if(user && user.password === "$Pl3aSeC4mbI3D3clV3#&"){
      this._loginService.logout();
    }else{
      try {
        let payload= (JSON.parse(atob(token.split('.')[1]))).exp;
        let expirado = this.expirado(payload);
        if (expirado) {
          this._loginService.logout();
          return false;
        }else{
          return true;
        }
      } catch (error) {
        this._loginService.logout();
        return false;
      }
    }
  }

  expirado(fechaExp:number){
    let ahora = new Date().getTime()/1000;
    if (fechaExp < ahora) {
      return true;
    } else {
      return false;
    }
  }
}