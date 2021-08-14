import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [],
})
export class BreadcrumbsComponent implements OnInit {
  titulo: string;

  constructor(
    private router: Router,
    private title: Title,
    private meta: Meta
  ) {
    // Nos subscribimos al observable y le asignamos el titulo a la variable global
    this.getDataRoutes().subscribe((data) => {
      this.titulo = data.titulo;
      this.title.setTitle('BPUS - ' + this.titulo);

      const metaTag: MetaDefinition = {
        name: 'description',
        content: this.titulo,
      };

      this.meta.updateTag(metaTag);
    });
  }

  ngOnInit(): void {}

  // Obtenemos la información de las rutas definiada en "pages.routes.ts"
  getDataRoutes() {
    return this.router.events.pipe(
      filter((evento) => evento instanceof ActivationEnd),
      filter((evento: ActivationEnd) => evento.snapshot.firstChild === null),
      map((evento: ActivationEnd) => evento.snapshot.data)
    );
  }
}
