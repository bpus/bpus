import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICES } from '../config/config';

@Pipe({
  name: 'imagen',
})
export class ImagenPipe implements PipeTransform {
  // Función para obtener la imagen de los usuarios

  transform(img: string, tipoUsuario: string): any {
    // Accedemos a la ruta de la imagen
    let url = URL_SERVICES + '/imagen';

    // Si no existe la imagen...
    if (!img) {
      return url + '/estudiante/NotFound';
    }

    // Switch para validar el tipo de usuario, y acceder a la url específica
    switch (tipoUsuario) {
      case 'estudiante':
        url += '/estudiantes/' + img;
        break;

      case 'administrativo':
        url += '/administrativos/' + img;
        break;
    }

    return url;
  }
}
