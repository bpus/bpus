import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from 'src/app/services/login/login.service';

@Injectable({
  providedIn: 'root'
})
export class NoLoginGuardGuard implements CanActivate {

  constructor ( private router: Router, private _loginService: LoginService) {}

  canActivate() {

    if (!this._loginService.logueado()){
      return true;
    } else {
        this.router.navigate(['/']);
    }

  }
  
}