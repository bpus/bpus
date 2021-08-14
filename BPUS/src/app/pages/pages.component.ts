import { Component, OnInit } from '@angular/core';

declare function init_plugins():any;

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [],
})
export class PagesComponent implements OnInit {
  // No estoy muy seguro si se usa, pero lo dejo por si acaso :v
  constructor() {}

  ngOnInit(): void {
    init_plugins();
  }
}
