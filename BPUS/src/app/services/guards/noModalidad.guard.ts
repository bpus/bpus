import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NoModalidadGuard implements CanActivate {
  constructor (private router:Router) {}

    canActivate () {
        const user = JSON.parse(localStorage.getItem('user'));
        if(user.codigo){
          if(!user.modalidad){
            return true;
          }else{
            this.router.navigate(['/']);
          }
        }else if(user){
          return true;
        }else{
          this.router.navigate(['/']);
        }
    }
}