import { Component, OnInit } from '@angular/core';
import {ModalidadService, ProgramaService} from 'src/app/services/service.index';

@Component({
  selector: 'app-modalidades',
  templateUrl: './modalidades.component.html',
  styleUrls: ['./modalidades.component.css'],
})
export class ModalidadesComponent implements OnInit {
  info = JSON.parse(localStorage.getItem("user"));
  modalidades: any[] = []; // Lista que almacenará la información de las modalidades
  porcentajeAprobado: number; // Porcentaje de créditos aprobados del estudiante

  // Inyectamos los servicios
  constructor(
    private _modalidadesService: ModalidadService,
    private _programaService: ProgramaService,
  ) {}

  ngOnInit(): void {
    this.calcularPorcentaje();
    this.getModalidades();
  }

    // Calculamos el porcentaje y se lo pasamos a la variable global
    calcularPorcentaje() {
      this._programaService.getPrograma().subscribe((resp: any) => {
        let credAprob:any;
        credAprob = this.info.creditos_aprobados;
        let programa = resp.programa;
        let creditosTotales = programa.creditos_totales;
        let porcent = (credAprob * 100) / creditosTotales;
        this.porcentajeAprobado = parseInt(porcent.toFixed(1));
        localStorage.setItem("porcentajeAprobado",this.porcentajeAprobado.toString());
      });
    }

  // Función que nos permite obtener la información de las modalidades
  getModalidades() {
    this._modalidadesService.getModalidades().subscribe((resp: any) => {
      this.modalidades = resp.modalidades;
    });
  }

}
