import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICES } from '../config/config';

@Pipe({
  name: 'documentoConvenio'
})
export class DocumentoConvenioPipe implements PipeTransform {

  transform(file: string, idConvenio: string): any {
    // Accedemos a la ruta de la imagen
    let url = URL_SERVICES + '/send_file_convenio';
    let token = localStorage.getItem('token');

    // Si no existe la imagen...
    if (file) {
        return url += `/${idConvenio}/${file}?token=${token}`;
    } 
  }
}