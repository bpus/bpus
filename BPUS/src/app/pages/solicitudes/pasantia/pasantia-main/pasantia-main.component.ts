import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pasantia',
  templateUrl: './pasantia-main.component.html'
})
export class PasantiaComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
    let porcentajeAprobado = parseInt(localStorage.getItem("porcentajeAprobado")) || 0;
    if( porcentajeAprobado < 90){
      this.router.navigate(["/modalidades"]);
    }
  }

}
