import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { LoginService } from 'src/app/services/login/login.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardGuard implements CanActivate {

  constructor (private _loginService: LoginService) {}

  // Lo ponemos en el path que queremos proteger
  // En este caso requisitos(app.routes) y panel-principal(pages.routes)
  canActivate() {

    // Si está logueado, retorne true (lo deja pasar)
    if ( this._loginService.logueado()){
      return true;
    } else {
      // Si no, lo devuelve al login
      return false;
      this._loginService.logout();
    }

  }
  
}
