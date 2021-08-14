import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-nopagefound',
  templateUrl: './nopagefound.component.html',
  styles: [
  ]
})
export class NopagefoundComponent implements OnInit {

  constructor(private _location: Location) 
  {}

  ngOnInit(): void {
  }

  goBack() {
    this._location.back();
  }

}
