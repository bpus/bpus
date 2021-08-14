import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Img, PdfMakeWrapper, Table, Txt } from 'pdfmake-wrapper';
import { AdministrativoService, LineaInvestigacionService, PasantiService, ProgramaService, ProyectoService } from 'src/app/services/service.index';

@Component({
  selector: 'app-gestion-modalidades',
  templateUrl: './gestion-modalidades.component.html'
})
export class GestionModalidadesComponent implements OnInit {

  user = JSON.parse(localStorage.getItem("user"));
  
  pipe = new DatePipe('en-US');
  meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  mesesAbv = ["Ene", "Feb", "Mzo", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

  programa:string;
  modalidadSelected:string = "";
  lineas:any;
  docentes:any;

  pasantias:any = [];
  pasantiaSelected:any;
  tutorPasantia = "";
  tutorPasantiaNombre = "";
  lineaPasantia = "";
  lineaPasantiaNombre = "";
  estadoPasantia = "";
  estadoFasePasantia:string = "";
  estadosPasantia = {pre: 0, env: 0, ejc: 0, sus: 0, apb: 0, ajt: 0}
  
  proyectos = [];
  proyectoSelected:any;
  directorProyecto = "";
  directorProyectoNombre = "";
  lineaProyecto = "";
  lineaProyectoNombre = "";
  estadoProyecto = "";
  estadoFaseProyecto:string = "";
  estadosProyecto = {pen: 0, env: 0, ejc: 0, sus: 0, apb: 0, ajt: 0}

  filtroPasantia:any = {programa: this.user.programa}
  filtroProyecto:any = {programa: this.user.programa}

  constructor(
    private _adminService: AdministrativoService,
    private _pasantiaService: PasantiService, 
    private _proyectoService: ProyectoService,
    private _lineaService: LineaInvestigacionService,
    private _programaService: ProgramaService
    ) { }

  ngOnInit(): void { this.getDocentes(); this.getLineas(); this.getProgramaInfo() }

  async getLineas(){
    this.lineas = await this._lineaService.getlineasJefe(this.user.programa).toPromise();
  }

  verOcultarFiltros(){
    const filtros = document.getElementById("filtros") as HTMLElement;
    const btnFiltros = document.getElementById("btnFiltros") as HTMLButtonElement;
    if(filtros.getAttribute("class") === "collapse show"){
      filtros.setAttribute("class", "collapse");
      btnFiltros.innerHTML = "Ver filtros";
    }else{
      filtros.setAttribute("class", "collapse show");
      btnFiltros.innerHTML = "Ocultar filtros";
    }
  }

  resetVisibilityFiltro(){
    const filtros = document.getElementById("filtros") as HTMLElement;
    const btnFiltros = document.getElementById("btnFiltros") as HTMLButtonElement;
    if(filtros && btnFiltros){
      filtros.setAttribute("class", "collapse show");
      btnFiltros.innerHTML = "Ocultar filtros";
    }
  }

  getModalidadSelected(){
    if(this.modalidadSelected === "Ambas"){
      this.clearFiltroPasantia();
      this.clearFiltroProyecto();
      this.resetVisibilityFiltro();
      this.getPasantias();
      this.getProyectos();
    }else if(this.modalidadSelected === "Pasantias"){
      this.clearFiltroProyecto();
      this.resetVisibilityFiltro();
      this.getPasantias();
    }else if(this.modalidadSelected === "Proyectos"){
      this.clearFiltroPasantia();
      this.resetVisibilityFiltro();
      this.getProyectos();
    }else{
      this.resetVisibilityFiltro();
      this.clearFiltroPasantia();
      this.clearFiltroProyecto();
    }
  }

  getFecha(){
    const fechaValue = (document.getElementById("fecha") as HTMLInputElement).value;
    let fechaArray:any = fechaValue.split(/\D/);
    if(fechaArray.length === 3){
      const fecha = new Date(fechaArray[0], --fechaArray[1], fechaArray[2]);
      if(this.modalidadSelected == 'Pasantias'){
        this.filtroPasantia.fecha_actaInicio = {$gte: fecha.toISOString()};
        this.getPasantias()
      }else if(this.modalidadSelected == 'Proyectos'){
        this.filtroProyecto.fecha_aprobacion = {$gte: fecha.toISOString()}
        this.getProyectos();
      }else if(this.modalidadSelected == 'Ambas'){
        this.filtroPasantia.fecha_actaInicio = {$gte: fecha.toISOString()};
        this.filtroProyecto.fecha_aprobacion = {$gte: fecha.toISOString()}
        this.getPasantias();
        this.getProyectos();
      }
    }else{
      if(this.modalidadSelected == 'Pasantias'){
        this.clearFiltroPasantia();
        this.getPasantias()
      }else if(this.modalidadSelected == 'Proyectos'){
        this.clearFiltroProyecto();
        this.getProyectos();
      }else if(this.modalidadSelected == 'Ambas'){
        this.clearFiltroPasantia();
        this.clearFiltroProyecto();
        this.getPasantias();
        this.getProyectos();
      }else{
        this.clearFiltroPasantia();
        this.clearFiltroProyecto();
      }
    }
  }

  getTutorPasantia(){
    if(this.tutorPasantia !== ""){
      this.filtroPasantia.tutor = this.tutorPasantia;
      const selectedIndex = (document.getElementById("tutorPasantia") as HTMLSelectElement).selectedIndex;
      this.tutorPasantiaNombre = this.docentes[selectedIndex-1].nombres+" "+this.docentes[selectedIndex-1].apellidos
      this.getPasantias();
    }else{
      delete this.filtroPasantia.tutor;
      this.tutorPasantiaNombre = "";
      this.getPasantias();
    }
  }

  getLineaPasantia(){
    if(this.lineaPasantia !== ""){
      this.filtroPasantia.lineaInvestigacion = this.lineaPasantia;
      const selectedIndex = (document.getElementById("lineaPasantia") as HTMLSelectElement).selectedIndex;
      this.lineaPasantiaNombre = this.lineas[selectedIndex-1].nombre;
      this.getPasantias();
    }else{
      delete this.filtroPasantia.lineaInvestigacion;
      this.lineaPasantiaNombre = "";
      this.getPasantias();
    }
  }

  getEstadoPasantia(){
    if(this.estadoPasantia !== ""){
      this.filtroPasantia.estado = this.estadoPasantia;
      this.getPasantias();
    }else{
      this.clearFiltroPasantia();
      this.getPasantias();
    }
  }

  getEstadoFasePasantia(){
    if(this.estadoFasePasantia !== ""){
      let fase = (this.estadoFasePasantia.split(":"))[0]
      let estado = (this.estadoFasePasantia.split(":"))[1]
      this.filtroPasantia[fase] = estado;
      this.getPasantias();
    }else{
      this.filtroPasantia = {programa: this.user.programa, estado: "En ejecución"};
      this.getPasantias();
    }
  }

  getEstadoProyecto(){
    if(this.estadoProyecto !== ""){
      this.filtroProyecto.estado = this.estadoProyecto;
      this.getProyectos();
    }else{
      this.clearFiltroProyecto();
      this.getProyectos();
    }
  }

  getDirectorProyecto(){
    if(this.directorProyecto !== ""){
      this.filtroProyecto.director = this.directorProyecto;
      const selectedIndex = (document.getElementById("directorProyecto") as HTMLSelectElement).selectedIndex;
      this.directorProyectoNombre = this.docentes[selectedIndex-1].nombres+" "+this.docentes[selectedIndex-1].apellidos
      this.getProyectos();
    }else{
      delete this.filtroProyecto.director;
      this.directorProyectoNombre = "";
      this.getProyectos();
    }
  }

  getLineaProyecto(){
    if(this.lineaProyecto !== ""){
      this.filtroProyecto.lineaInvestigacion = this.lineaProyecto;
      const selectedIndex = (document.getElementById("lineaProyecto") as HTMLSelectElement).selectedIndex;
      this.lineaProyectoNombre = this.lineas[selectedIndex-1].nombre;
      this.getProyectos();
    }else{
      delete this.filtroProyecto.lineaInvestigacion;
      this.lineaProyectoNombre = "";
      this.getProyectos();
    }
  }

  getEstadoFaseProyecto(){
    if(this.estadoFaseProyecto !== ""){
      let fase = (this.estadoFaseProyecto.split(":"))[0]
      let estado = (this.estadoFaseProyecto.split(":"))[1]
      this.filtroProyecto[fase] = estado;
      this.getProyectos();
    }else{
      this.filtroProyecto = {programa: this.user.programa, estado: "En ejecución"};
      this.getProyectos();
    }
  }

  filtroPasantiaRemove(property:string){
    delete this.filtroPasantia[property];
    if(property === "estado"){
      this.estadoPasantia = "";
    }
    if(property == "tutor"){
      this.tutorPasantiaNombre = "";
      this.tutorPasantia = "";
    }
    if(property == "lineaInvestigacion"){
      this.lineaPasantia = "";
      this.lineaPasantiaNombre = "";
    }
    if((Object.getOwnPropertyNames(this.filtroPasantia)).length === 1){
      this.estadoPasantia = "";
    }
    this.getPasantias();
  }

  filtroProyectoRemove(property:string){
    delete this.filtroProyecto[property];
    if(property === "estado"){
      this.estadoProyecto = "";
    }
    if(property == "director"){
      this.directorProyectoNombre = "";
      this.directorProyecto = "";
    }
    if(property == "lineaInvestigacion"){
      this.lineaProyecto = "";
      this.lineaProyectoNombre = "";
    }
    if((Object.getOwnPropertyNames(this.filtroProyecto)).length === 1){
      this.estadoProyecto = "";
    }
    this.getProyectos();
  }

  getPasantiaSelected(pasantia:any){
    this.pasantiaSelected = pasantia;
  }

  getProyectoSelected(proyecto:any){
    this.proyectoSelected = proyecto;
  }

  clearFiltroPasantia(){
    (document.getElementById("divResultados") as HTMLElement).setAttribute("style", "display:none;");
    this.pasantias = [];
    this.estadoPasantia = "";
    this.tutorPasantia = "";
    this.tutorPasantiaNombre = "";
    this.lineaPasantia = "";
    this.lineaPasantiaNombre = "";
    this.estadoFasePasantia = "";
    this.filtroPasantia = {programa: this.user.programa};
  }

  clearFiltroProyecto(){
    (document.getElementById("divResultados") as HTMLElement).setAttribute("style", "display:none;");
    this.proyectos = [];
    this.directorProyecto = "";
    this.directorProyectoNombre = "";
    this.lineaProyecto = "";
    this.lineaProyectoNombre = "";
    this.estadoProyecto = "";
    this.estadoFaseProyecto = "";
    this.filtroProyecto = {programa: this.user.programa};
  }

  async generarPDf(){
    const pdf = new PdfMakeWrapper();
    pdf.pageSize('A4');
    pdf.pageMargins([ 30, 100 , 30, 50 ]);

    let currentDate = new Date();
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    let dateText = currentDate.getDate() + ' de '+ meses[currentDate.getMonth()] + ' de ' + currentDate.getFullYear();
    
    pdf.info({
      title: 'Informe - '+this.programa+' - '+dateText,
      author: 'BPUS',
      subject: 'Informe de modalidades de grado del programa de'+this.programa+' - '+dateText
    }); 

    // HEADER
    const headerUsco = (document.getElementById('headerUsco')) as HTMLImageElement;
    const canvasHeader = (document.createElement('canvas')) as HTMLCanvasElement;
    canvasHeader.width = headerUsco.width;
    canvasHeader.height = 75;  
    canvasHeader.getContext('2d').drawImage(headerUsco, 0, 0, 595, 75);
    const imgHeader = canvasHeader.toDataURL('image/jpeg');

    // Footer
    const footerUsco = (document.getElementById('footerUsco')) as HTMLImageElement;
    const canvasFooter = (document.createElement('canvas')) as HTMLCanvasElement;
    canvasFooter.width = footerUsco.width; 
    canvasFooter.height = 52; 
    canvasFooter.getContext('2d').drawImage(footerUsco, 0, 0, 595, 52);
    const imgFooter = canvasFooter.toDataURL('image/jpeg');

    pdf.header(await new Img(imgHeader).build());
    pdf.footer(await new Img(imgFooter).build());

    pdf.add(new Txt('Informe de modalidades de grado de '+this.programa).alignment('center').italics().fontSize(20).margin([0,0,0,30]).end);
    pdf.add(new Txt('Fecha: '+dateText).alignment('left').margin([0,0,0,0]).end);

    if(this.pasantias.length > 0){
      pdf.add(new Txt('Pasantías').fontSize(16).margin([0,20,0,0]).alignment('left').bold().end);
      pdf.add(new Txt('Totales: '+this.pasantias.length).alignment('left').margin([0,10,0,0]).end);
      pdf.add(
        new Txt(
          'PreInscritas: '+this.estadosPasantia.pre+
          '       Enviadas: '+this.estadosPasantia.env+
          '       En ejecución: '+this.estadosPasantia.ejc+
          '       Sustentación: '+this.estadosPasantia.sus+
          '       Aprobadas: '+this.estadosPasantia.apb+
          '       Ajustar: '+this.estadosPasantia.ajt
        )
        .alignment('left').margin([0,10,0,0]).end
      );
      let table = [];
      let cell = [ 
        new Txt('#').alignment('center').end, 
        new Txt('Título').alignment('center').end, 
        new Txt('Estado').alignment('center').end, 
        new Txt('Fecha inicio').alignment('center').end,
        new Txt('Sem.').alignment('center').end,
      ];
      table.push(cell); 
      for (let i = 0; i < this.pasantias.length; i++) {
        cell = [ 
          new Txt((i+1).toString()).margin([0,3,0,3]).alignment('center').end, 
          new Txt(`${this.pasantias[i].titulo}`).margin([10,3,0,3]).alignment('center').end, 
          new Txt(`${this.pasantias[i].estado}`).margin([0,3,0,3]).alignment('center').end, 
          new Txt(`${this.pasantias[i].fecha_inicio}`).margin([0,3,0,3]).alignment('center').end,
          new Txt(this.pasantias[i].semanas).margin([0,3,0,3]).alignment('center').end,
        ]; 
        table.push(cell);
      }
      pdf.add(new Table(table).margin([0, 10, 0, 0]).widths(['auto','*','auto','auto','auto']).end);
      pdf.add(new Txt('Sem.  =  Semanas').alignment("left").italics().bold().fontSize(10).margin([10,5,0,0]).end);
    }

    if(this.proyectos.length > 0){
      pdf.add(new Txt('Proyectos de grado').fontSize(16).margin([0,20,0,0]).alignment('left').bold().end);
      pdf.add(new Txt('Totales: '+this.proyectos.length).alignment('left').margin([0,10,0,0]).end);
      pdf.add(
        new Txt(
          'Pendientes: '+this.estadosProyecto.pen+
          '       Enviados: '+this.estadosProyecto.env+
          '       En ejecución: '+this.estadosProyecto.ejc+
          '       Sustentación: '+this.estadosProyecto.sus+
          '       Aprobados: '+this.estadosProyecto.apb+
          '       Ajustar: '+this.estadosProyecto.ajt
        )
        .alignment('left').margin([0,10,0,0]).end
      );
      let table = [];
      let cell = [ 
        new Txt('#').alignment('center').end, 
        new Txt('Título').alignment('center').end, 
        new Txt('Estado').alignment('center').end, 
        new Txt('Fecha inicio').alignment('center').end,
        new Txt('Sem.').alignment('center').end,
      ];
      table.push(cell); 
      for (let i = 0; i < this.proyectos.length; i++) {
        cell = [ 
          new Txt((i+1).toString()).margin([0,3,0,3]).alignment('center').end, 
          new Txt(`${this.proyectos[i].titulo}`).margin([10,3,0,3]).alignment('center').end, 
          new Txt(`${this.proyectos[i].estado}`).margin([0,3,0,3]).alignment('center').end, 
          new Txt(`${this.proyectos[i].fecha_inicio}`).margin([0,3,0,3]).alignment('center').end,
          new Txt(`${this.proyectos[i].semanas}`).margin([0,3,0,3]).alignment('center').end,
        ]; 
        table.push(cell);
      }
      pdf.add(new Table(table).margin([0, 10, 0, 0]).widths(['auto','*','auto','auto','auto']).end);
      pdf.add(new Txt('Sem.  =  Semanas').alignment("left").italics().bold().fontSize(10).margin([10,5,0,0]).end);
    }

    pdf.create().open();

  }

  async getDocentes(){
    const resp:any = await this._adminService.getTutores(this.user.programa).toPromise();
    this.docentes = resp.admins;
  }

  async getPasantias(){
    this.pasantias = await this._pasantiaService.getPasantiaFiltro(this.filtroPasantia).toPromise();
    if(this.proyectos.length === 0 && this.pasantias.length === 0){
      (document.getElementById("divResultados") as HTMLElement).setAttribute("style", "display:block;");
    }else{
      (document.getElementById("divResultados") as HTMLElement).setAttribute("style", "display:none;");
    }
    this.estadosPasantia = {pre: 0, env: 0, ejc: 0, sus: 0, apb: 0, ajt: 0}
    for (let i = 0; i < this.pasantias.length; i++) {
      let currentDate = new Date();
      let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
      if(this.pasantias[i].fecha_actaInicio){
        let fechaInicio = new Date(Date.parse(this.pasantias[i].fecha_actaInicio));
        this.pasantias[i].fecha_actaInicio = this.meses[fechaInicio.getMonth()]+" "+this.pipe.transform(fechaInicio, 'dd')+", "+fechaInicio.getFullYear();
        this.pasantias[i].fecha_inicio = this.mesesAbv[fechaInicio.getMonth()]+" "+this.pipe.transform(fechaInicio, 'dd')+", "+fechaInicio.getFullYear();
        let diff = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate()) ) /(1000 * 60 * 60 * 24 * 7));
        if(Math.floor(diff) === 0){
          this.pasantias[i].semanas = 1;
        }else{
          this.pasantias[i].semanas = Math.floor(diff);
        }
      }else{
        this.pasantias[i].semanas = 0;
        this.pasantias[i].fecha_inicio = '---';
        this.pasantias[i].fecha_actaInicio = '---';
      }
      if(this.pasantias[i].estado === "PreInscrita"){
        this.estadosPasantia.pre = this.estadosPasantia.pre+1;
      }
      if(this.pasantias[i].estado === "Enviada"){
        this.estadosPasantia.env = this.estadosPasantia.env+1;
      }
      if(this.pasantias[i].estado === "Ajustar"){
        this.estadosPasantia.ajt = this.estadosPasantia.ajt+1;
      }
      if(this.pasantias[i].estado === "En ejecución"){
        this.estadosPasantia.ejc = this.estadosPasantia.ejc+1;
      }
      if(this.pasantias[i].estado === "Sustentación"){
        this.estadosPasantia.sus = this.estadosPasantia.sus+1;
      }
      if(this.pasantias[i].estado === "Aprobada"){
        this.estadosPasantia.apb = this.estadosPasantia.apb+1;
      }
    }
    this.pasantias.sort(function(a, b) {
      return  b.semanas - a.semanas;
    });
  }

  async getProyectos(){
    this.proyectos = await this._proyectoService.getProyectosFiltro(this.filtroProyecto).toPromise();
    if(this.proyectos.length === 0 && this.pasantias.length === 0){
      (document.getElementById("divResultados") as HTMLElement).setAttribute("style", "display:block;");
    }else{
      (document.getElementById("divResultados") as HTMLElement).setAttribute("style", "display:none;");
    }
    this.estadosProyecto = {pen: 0, env: 0, ejc: 0, sus: 0, apb: 0, ajt: 0}
    for (let i = 0; i < this.proyectos.length; i++) {
      let currentDate = new Date();
      if(this.proyectos[i].fecha_aprobacion){
        let fechaInicio = new Date(Date.parse(this.proyectos[i].fecha_aprobacion));
        this.proyectos[i].fecha_aprobacion =  this.meses[fechaInicio.getMonth()]+" "+this.pipe.transform(fechaInicio, 'dd')+", "+fechaInicio.getFullYear();
        this.proyectos[i].fecha_inicio = this.mesesAbv[fechaInicio.getMonth()]+" "+this.pipe.transform(fechaInicio, 'dd')+", "+fechaInicio.getFullYear();
        let diff = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate()) ) /(1000 * 60 * 60 * 24 * 7));
        if(Math.floor(diff) === 0){
          this.proyectos[i].semanas = 1;
        }else{
          this.proyectos[i].semanas = Math.floor(diff);
        }
      }else{
        this.proyectos[i].semanas = 0;
        this.proyectos[i].fecha_inicio = '---';
        this.proyectos[i].fecha_aprobacion = '---';
      }
      if(this.proyectos[i].estado === "Pendiente"){
        this.estadosProyecto.pen = this.estadosProyecto.pen+1;
      }
      if(this.proyectos[i].estado === "Enviado"){
        this.estadosProyecto.env = this.estadosProyecto.env+1;
      }
      if(this.proyectos[i].estado === "Ajustar"){
        this.estadosProyecto.ajt = this.estadosProyecto.ajt+1;
      }
      if(this.proyectos[i].estado === "En ejecución"){
        this.estadosProyecto.ejc = this.estadosProyecto.ejc+1;
      }
      if(this.proyectos[i].estado === "Sustentación"){
        this.estadosProyecto.sus = this.estadosProyecto.sus+1;
      }
      if(this.proyectos[i].estado === "Aprobado"){
        this.estadosProyecto.apb = this.estadosProyecto.apb+1;
      }
    }
    this.proyectos.sort(function(a, b) {
      return  b.semanas - a.semanas;
    });
  }

  getProgramaInfo() {
    this._programaService.getPrograma().subscribe((resp:any) => {
      this.programa = resp.programa.nombre;
    });
  }

}