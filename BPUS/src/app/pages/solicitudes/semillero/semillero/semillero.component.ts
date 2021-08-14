import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-semillero',
  templateUrl: './semillero.component.html'
})
export class SemilleroComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
    this.router.navigate(["/modalidades"]);
  }

}
