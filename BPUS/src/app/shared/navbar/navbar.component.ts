import { Component, OnInit } from '@angular/core';
import { LoginService, NotificacionesService } from 'src/app/services/service.index';
import { Router } from '@angular/router';
import {interval} from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [],
})
export class NavbarComponent implements OnInit {
  // Obtenemos toda la información del usuario
  info = JSON.parse(localStorage.getItem('user'));
  numeroNotificaciones: number;

  // Inyectamos el loginService para hacer el logOut directamente en el html
  constructor(
    private _notificacionService: NotificacionesService, 
    private router: Router,
    private _loginService:LoginService
  ) {}

  ngOnInit(): void {
    this.cargarNotificacionesNav();
    const contador = interval(60000).subscribe((n) => {
      if(this.info && localStorage.getItem("token")){
        this.cargarNotificacionesNav();
      }else{
        contador.unsubscribe();
      }
    });
  }

  logout(){
    this._loginService.logout();
  }

  cargarNotificacionesNav():void {
    this._notificacionService.getNotificacionesNav(this.info._id).subscribe((resp:any) => {
      this.numeroNotificaciones = resp.notificaciones.length;
    });
  }

  // Función que direcciona cuando se da click en "perfil"
  irPerfil() {
    this.router.navigate(['/perfil']);
  }
}
