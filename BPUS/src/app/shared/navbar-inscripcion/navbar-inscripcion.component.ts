import { Component, OnInit } from '@angular/core';
import { LoginService, ProgramaService } from 'src/app/services/service.index';

@Component({
  selector: 'app-navbar-inscripcion',
  templateUrl: './navbar-inscripcion.component.html'
})
export class NavbarInscripcionComponent implements OnInit {

  // Obtenemos toda la información del usuario
  info = JSON.parse(localStorage.getItem('user'));
  tipoUsuario: string;
  programa: String;

  // Inyectamos el loginService para hacer el logOut directamente en el html
  constructor(private _programaService: ProgramaService, private _loginService: LoginService) { }

  ngOnInit(): void {;
    this.getPrograma();
  }

  logout(){
    this._loginService.logout();
  }

  // Obtenemos el programa y lo pasamos a la variable Programa
  getPrograma() {
    this._programaService.getPrograma().subscribe((resp) => {
      let infoPrograma = resp['programa'];
      this.programa = infoPrograma.nombre;
    });
  }

}
