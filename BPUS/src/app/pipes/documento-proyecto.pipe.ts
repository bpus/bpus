import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICES } from '../config/config';

@Pipe({
  name: 'documentoP'
})
export class DocumentoProyectoPipe implements PipeTransform {

  transform(file: string, idEstudiante: string): any {
    // Accedemos a la ruta de la imagen
    let url = URL_SERVICES + '/send_file_proyecto';
    let token = localStorage.getItem('token');

    // Si no existe la imagen...
    if (!file) {
      return url + '/estudiante/NotFound';

    } else {
      return url += `/${idEstudiante}/${file}?token=${token}`;
    }
  }
}