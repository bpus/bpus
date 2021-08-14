import { NgModule } from '@angular/core';
import { ImagenPipe } from './imagen.pipe';
import { DocumentoPipe } from './documento.pipe';
import { DocumentoConvenioPipe } from './documento-convenio.pipe';
import { DocumentoProyectoPipe } from './documento-proyecto.pipe';

// Lo importamos donde se van a a utilizar (PagesModule y SharedModule)

@NgModule({
  declarations: [
    ImagenPipe,
    DocumentoPipe,
    DocumentoConvenioPipe,
    DocumentoProyectoPipe
  ],
  imports: [],
  exports: [
    ImagenPipe,
    DocumentoPipe,
    DocumentoConvenioPipe,
    DocumentoProyectoPipe
  ]
})
export class PipesModule { }
