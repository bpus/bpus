import { Component, OnInit } from '@angular/core';
import { ProyectoService, NotificacionesService, PasantiService, ProgramaService } from 'src/app/services/service.index';
import { Notificacion } from 'src/app/models/notificacion.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tutorias',
  templateUrl: './tutorias.component.html'
})
export class TutoriasComponent implements OnInit {
  user = JSON.parse(localStorage.getItem("user"))
  proyectos: any[];
  proyectoSelected: any;
  //Nuevos estados
  new_estado_inscripcion:string = "";
  new_estado_anteproyecto:string = "";
  new_estado_proyecto:string = "";
  //Nuevas notas
  new_notas_inscripcion:string = "";
  new_notas_anteproyecto:string = "";
  new_notas_proyecto:string = "";

  pasantias: any[];
  pasantiaSelected: any;
  //Nuevos estados
  new_estado_propuesta:string = "";
  new_estado_actaInicio:string = "";
  new_estado_informe7:string = "";
  new_estado_informe14:string = "";
  new_estado_informeFinal:string = "";
  //Nuevas notas
  new_notas_propuesta:string = "";
  new_notas_actaInicio:string = "";
  new_notas_informe7:string = "";
  new_notas_informe14:string = "";
  new_notas_informeFinal:string = "";

  jefe:any;

  constructor(
    private _notificacionService: NotificacionesService, 
    private _proyectoService: ProyectoService,
    private _programaService: ProgramaService,
    private _pasantiaService: PasantiService) { }

  ngOnInit(): void {
    this.getProyectos();
    this.getPasantias();
    this.getProgramaInfo();
  }

  getProgramaInfo() {
    this._programaService.getPrograma().subscribe((resp) => {
      let infoPrograma = resp['programa'];
      this.jefe = infoPrograma.jefe;
    });
  }

  activeTab(tab: string) {
    const activeTab = document.getElementById(tab);
    const pasantiaTab = document.getElementById('pasantiaTab');
    const proyectoTab = document.getElementById('proyectoTab');
    pasantiaTab.setAttribute('class', 'nav-link text-body');
    proyectoTab.setAttribute('class', 'nav-link text-body');
    activeTab.setAttribute('class', 'nav-link activeTab font-weight-bold');
  }

  getProyectos() {
    const user  = JSON.parse(localStorage.getItem('user'));
    this._proyectoService.getProyectosDirector(user._id).subscribe((resp: any) => {
      this.proyectos = resp.proyectos;
      let currentDate = new Date();
      for (let i = 0; i < this.proyectos.length; i++) {
        if(this.proyectos[i].fecha_aprobacion){
          let fechaInicio = new Date(Date.parse(this.proyectos[i].fecha_aprobacion));
          let diff = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate()) ) /(1000 * 60 * 60 * 24 * 7));
          if(Math.floor(diff) === 0){
            this.proyectos[i].semanas = 1;
          }else if(Math.floor(diff) > 0 && Math.floor(diff) <= 52){
            this.proyectos[i].semanas = Math.floor(diff);
          }else{
            this.proyectos[i].semanas = 52;
          }
        }
      }
    })
  }

  putProyecto(){
    Swal.fire({
      title: '¿Guardar cambios?',
      icon: 'warning',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si',
      showCancelButton: true,
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.value) {
        let proyecto:any = {};
        if(this.new_estado_inscripcion){
          proyecto.estado_propuesta = this.new_estado_inscripcion;
        }
        if(this.new_estado_anteproyecto){
          proyecto.estado_anteproyecto = this.new_estado_anteproyecto;
        }
        if(this.new_estado_proyecto){
          proyecto.estado_proyecto = this.new_estado_proyecto;
        }
        if(this.new_notas_inscripcion){
          proyecto.notas_propuesta = this.new_notas_inscripcion;
        }
        if(this.new_notas_anteproyecto){
          proyecto.notas_anteproyecto = this.new_notas_anteproyecto;
        }
        if(this.new_notas_proyecto){
          proyecto.notas_proyecto = this.new_notas_proyecto;
        }
        let txtAprobado:string  = "";
        let txtAjustar:string  = "";  
        if(this.new_estado_inscripcion === "Aprobada" || this.new_estado_anteproyecto === "Aprobado" || this.new_estado_proyecto === "Aprobado"){
          txtAprobado = "Documentos aprobados:";
          if(this.new_estado_inscripcion === "Aprobada"){
            txtAprobado = `${txtAprobado}
              - Propuesta`;
          }
          if(this.new_estado_anteproyecto === "Aprobado"){
            txtAprobado = `${txtAprobado}
              - Anteproyecto`;
          }
          if(this.new_estado_proyecto === "Aprobado"){
            txtAprobado = `${txtAprobado}
              - Proyecto`;
          }
        }
        if(this.new_estado_inscripcion === "Ajustar" || this.new_estado_anteproyecto === "Ajustar" || this.new_estado_proyecto === "Ajustar"){
          txtAjustar = "Documentos por ajustar:";
          if(this.new_estado_inscripcion === "Ajustar"){
            txtAjustar = `${txtAjustar}
              - Propuesta`;
          }
          if(this.new_estado_anteproyecto === "Ajustar"){
            txtAjustar = `${txtAjustar}
              - Anteproyecto`;
          }
          if(this.new_estado_proyecto === "Ajustar"){
            txtAjustar = `${txtAjustar}
              - Proyecto`;
          }
        }
        const btnCloseModalGestion = (document.getElementById("btnCloseModalGestion")) as HTMLElement;
        btnCloseModalGestion.click();
        Swal.fire({
          title: 'Por favor espera!',
          html: '<b></b>',
          allowEnterKey: false,
          allowEscapeKey: false,
          allowOutsideClick: false,
          showCancelButton: false,
          showCloseButton: false,
          showConfirmButton:false,
          timer: 1000*60*2,
          timerProgressBar: true,
          onOpen: () => {
            Swal.showLoading();
            const content = Swal.getHtmlContainer();
            const b = content.querySelector('b');
            b.textContent = "Guardando cambios";
            this._proyectoService.putDirectorProyecto(this.proyectoSelected._id, proyecto).subscribe(async(resp:any)=>{
              if(resp){
                const fechaActual = new Date();
                let txt = "";
                if(txtAprobado ! == "" && txtAjustar !== ""){
                  txt = `${txtAprobado}
                      ${txtAjustar}`;
                }else if(txtAprobado !== ""){
                  txt = txtAprobado;
                }else if(txtAjustar !== ""){
                  txt = txtAjustar;
                }
                if(resp.estado === "Sustentación"){
                  txt = `${txt}
                Queda pendiente que el jefe de programa te asigne los jurados, la fecha y lugar de la sustentación`;
                  let notiJefe = new Notificacion(
                    this.jefe._id,
                    fechaActual,
                    "Proyecto pendiente de sustentación",
                    `El proyecto: '${resp.titulo}' ha sido aprobado por su director y queda pendiente de asignación de jurados y sustentación`,
                    "Estudiante",
                    this.jefe.correo
                  );
                  b.textContent = "Enviando notificación al jefe de programa";
                  await this._notificacionService.postNotificacion(notiJefe).toPromise();
                  await this._notificacionService.sendNotificacionCorreo(notiJefe).toPromise();
                }
                if(txt !== ""){
                  let notiE = new Notificacion(
                    this.proyectoSelected.estudiante._id,
                    fechaActual,
                    "Tu director ha calificado el proyecto",
                    txt,
                    "Estudiante",
                    this.proyectoSelected.estudiante.correo
                  );
                  b.textContent = "Enviando notificación a "+this.proyectoSelected.estudiante.nombres;
                  await this._notificacionService.postNotificacion(notiE).toPromise();
                  await this._notificacionService.sendNotificacionCorreo(notiE).toPromise();
                  if(this.proyectoSelected.estudiante2){
                    notiE.receptor = this.proyectoSelected.estudiante2._id;
                    notiE.receptorCorreo = this.proyectoSelected.estudiante2.correo;
                    b.textContent = "Enviando notificación a "+this.proyectoSelected.estudiante2.nombres;
                    await this._notificacionService.postNotificacion(notiE).toPromise();
                    await this._notificacionService.sendNotificacionCorreo(notiE).toPromise();
                  }
                  if(this.proyectoSelected.estudiante3){
                    notiE.receptor = this.proyectoSelected.estudiante3._id;
                    notiE.receptorCorreo = this.proyectoSelected.estudiante3.correo;
                    b.textContent = "Enviando notificación a "+this.proyectoSelected.estudiante3.nombres;
                    await this._notificacionService.postNotificacion(notiE).toPromise();
                    await this._notificacionService.sendNotificacionCorreo(notiE).toPromise();
                  }
                }
                Swal.close();
              }
            });
          },
          onClose: () => {
            Swal.fire({
              title: '¡Bien Hecho!',
              html: `Proyecto actualizado correctamente`,
              icon: 'success',
              allowEnterKey: false,
              allowEscapeKey: false,
              allowOutsideClick: false,
              showCancelButton: false,
              showCloseButton: false,
              showConfirmButton:false,
              timer: 1300,
              timerProgressBar: true
            }).then(() => {
            this.getProyectos();
            });
          }
        }).then(() => {
          this.getProyectos();
        });
      }
    })
  }

  ajusteInscripcion(){
    this.new_estado_inscripcion = 'Ajustar';
    let notasInscripcion = (document.getElementById("notasInscripcion")) as HTMLElement;
    let btnAjusteInscripcion = (document.getElementById("btnAjusteInscripcion")) as HTMLElement;
    let notas_propuesta = (document.getElementById("notas_propuesta")) as HTMLElement;
    notasInscripcion.setAttribute('colspan','5');
    btnAjusteInscripcion.setAttribute('style','display:none');
    notas_propuesta.setAttribute('class','collapse');
    if(this.proyectoSelected.estado_propuesta !== "Enviada") {
      let cancelarAjusteInscripcion = (document.getElementById('cancelarAjusteInscripcion')) as HTMLButtonElement;
      cancelarAjusteInscripcion.setAttribute('style', 'display:block; color: #8F141B');
    }
  }

  notasInscripcion(){
    let notasInscripcion = (document.getElementById("notasInscripcion")) as HTMLElement;
    let notas_propuesta = (document.getElementById("notas_propuesta")) as HTMLElement;
    let btnAjusteInscripcion = (document.getElementById("btnAjusteInscripcion")) as HTMLElement;
    if(this.proyectoSelected?.estado_propuesta === 'Aprobada'){
      let ajusteInscripcion = (document.getElementById('ajusteInscripcion')) as HTMLButtonElement;
      notasInscripcion.setAttribute('colspan','4');
      notas_propuesta.setAttribute('class','collapse show');
      btnAjusteInscripcion.setAttribute('style','display:block');
      ajusteInscripcion.setAttribute('style', 'display:none');
    }else if(this.new_estado_inscripcion === 'Ajustar'){
      notasInscripcion.setAttribute('colspan','4');
      notas_propuesta.setAttribute('class','collapse show');
      btnAjusteInscripcion.setAttribute('style','display:block');
    }else if(this.new_estado_inscripcion === "Aprobada"){
      this.new_notas_inscripcion = "";
      notasInscripcion.setAttribute('colspan','5');
      notas_propuesta.setAttribute('class','collapse');
      btnAjusteInscripcion.setAttribute('style','display:none');
    }else{
      if(this.proyectoSelected.notas_propuesta){
        this.new_notas_inscripcion = this.proyectoSelected.notas_propuesta;
      }else{
        this.new_notas_inscripcion = "";
      }
      notasInscripcion.setAttribute('colspan','5');
      notas_propuesta.setAttribute('class','collapse');
      btnAjusteInscripcion.setAttribute('style','display:none');
    }
  }

  cancelarAjusteInscripcion(){
    this.new_estado_inscripcion = '';
    if(this.proyectoSelected.notas_propuesta){
      this.new_notas_inscripcion = this.proyectoSelected.notas_propuesta;
    }else{
      this.new_notas_inscripcion = "";
    }
    let notasInscripcion = (document.getElementById("notasInscripcion")) as HTMLElement;
    let btnAjusteInscripcion = (document.getElementById("btnAjusteInscripcion")) as HTMLElement;
    let notas_propuesta = (document.getElementById("notas_propuesta")) as HTMLElement;
    notasInscripcion.setAttribute('colspan','5');
    btnAjusteInscripcion.setAttribute('style','display:none');
    notas_propuesta.setAttribute('class','collapse');
    if(this.proyectoSelected.estado_propuesta !== "Enviada") {
      let ajusteInscripcion = (document.getElementById('ajusteInscripcion')) as HTMLButtonElement;
      let cancelarAjusteInscripcion = (document.getElementById('cancelarAjusteInscripcion')) as HTMLButtonElement;
      ajusteInscripcion.setAttribute('style', 'display:block');
      cancelarAjusteInscripcion.setAttribute('style', 'display:none;');
    }
  }

  ajusteAnteproyecto(){
    this.new_estado_anteproyecto = 'Ajustar';
    let notasAnteproyecto = (document.getElementById("notasAnteproyecto")) as HTMLElement;
    let notas_anteproyecto = (document.getElementById("notas_anteproyecto")) as HTMLElement;
    let btnAjusteAnteproyecto = (document.getElementById("btnAjusteAnteproyecto")) as HTMLElement;
    notasAnteproyecto.setAttribute('colspan','5');
    btnAjusteAnteproyecto.setAttribute('style','display:none');
    notas_anteproyecto.setAttribute('class','collapse');
    if(this.proyectoSelected.estado_anteproyecto !== "Enviado") {
      let cancelarAjusteAnteproyecto = (document.getElementById('cancelarAjusteAnteproyecto')) as HTMLButtonElement;
      cancelarAjusteAnteproyecto.setAttribute('style', 'display:block; color: #8F141B');
    }
  }

  notasAnteproyecto(){
      let notasAnteproyecto = (document.getElementById("notasAnteproyecto")) as HTMLElement;
      let notas_anteproyecto = (document.getElementById("notas_anteproyecto")) as HTMLElement;
      let btnAjusteAnteproyecto = (document.getElementById("btnAjusteAnteproyecto")) as HTMLElement;
      if(this.proyectoSelected?.estado_anteproyecto === 'Aprobado'){
        let ajusteAnteproyecto = (document.getElementById('ajusteAnteproyecto')) as HTMLButtonElement;
        notasAnteproyecto.setAttribute('colspan','4')
        notas_anteproyecto.setAttribute('class','collapse show');
        btnAjusteAnteproyecto.setAttribute('style','display:block');
        ajusteAnteproyecto.setAttribute('style', 'display:none');
      }else if(this.new_estado_anteproyecto === 'Ajustar'){
        notasAnteproyecto.setAttribute('colspan','4');
        notas_anteproyecto.setAttribute('class','collapse show');
        btnAjusteAnteproyecto.setAttribute('style','display:block');
      }else{
        if(this.proyectoSelected.notas_anteproyecto){
          this.new_notas_anteproyecto = this.proyectoSelected.notas_anteproyecto;
        }else{
          this.new_notas_anteproyecto = "";
        }
        notas_anteproyecto.setAttribute('class','collapse');
        notasAnteproyecto.setAttribute('colspan','5');
        btnAjusteAnteproyecto.setAttribute('style','display:none');
      }
  }

  cancelarAjusteAnteproyecto(){
    this.new_estado_anteproyecto = '';
    if(this.proyectoSelected.notas_anteproyecto){
      this.new_notas_anteproyecto = this.proyectoSelected.notas_anteproyecto;
    }else{
      this.new_notas_anteproyecto = "";
    }
    let notasAnteproyecto = (document.getElementById("notasAnteproyecto")) as HTMLElement;
    let btnAjusteAnteproyecto = (document.getElementById("btnAjusteAnteproyecto")) as HTMLElement;
    let notas_anteproyecto = (document.getElementById("notas_anteproyecto")) as HTMLElement;
    btnAjusteAnteproyecto.setAttribute('style','display:none');
    notas_anteproyecto.setAttribute('class','collapse');
    notasAnteproyecto.setAttribute('colspan','5');
    if(this.proyectoSelected.estado_anteproyecto !== "Enviado") {
      let ajusteAnteproyecto = (document.getElementById('ajusteAnteproyecto')) as HTMLButtonElement;
      let cancelarAjusteAnteproyecto = (document.getElementById('cancelarAjusteAnteproyecto')) as HTMLButtonElement;
      ajusteAnteproyecto.setAttribute('style', 'display:block');
      cancelarAjusteAnteproyecto.setAttribute('style', 'display:none;');
    }
  }

  ajusteProyecto(){
    this.new_estado_proyecto = 'Ajustar';
    let notasProyecto = (document.getElementById("notasProyecto")) as HTMLElement;
    let notas_proyecto = (document.getElementById("notas_proyecto")) as HTMLElement;
    let btnAjusteProyecto = (document.getElementById("btnAjusteProyecto")) as HTMLElement;
    notasProyecto.setAttribute('colspan','5');
    btnAjusteProyecto.setAttribute('style','display:none');
    notas_proyecto.setAttribute('class','collapse');
    if(this.proyectoSelected.estado_proyecto !== "Enviado") {
      let btnAjusteProyecto = (document.getElementById('btnAjusteProyecto')) as HTMLButtonElement;
      btnAjusteProyecto.setAttribute('style', 'display:block; color: #8F141B');
    }
  }

  notasProyecto(){
      let notasProyecto = (document.getElementById("notasProyecto")) as HTMLElement;
      let notas_proyecto = (document.getElementById("notas_proyecto")) as HTMLElement;
      let btnAjusteProyecto = (document.getElementById("btnAjusteProyecto")) as HTMLElement;
      if(this.proyectoSelected?.estado_proyecto === 'Aprobado'){
        let ajusteProyecto = (document.getElementById('ajusteProyecto')) as HTMLButtonElement;
        notasProyecto.setAttribute('colspan','4')
        notas_proyecto.setAttribute('class','collapse show');
        btnAjusteProyecto.setAttribute('style','display:block');
        ajusteProyecto.setAttribute('style', 'display:none');
      }else if(this.new_estado_proyecto === 'Ajustar'){
        notasProyecto.setAttribute('colspan','4');
        notas_proyecto.setAttribute('class','collapse show');
        btnAjusteProyecto.setAttribute('style','display:block');
      }else{
        if(this.proyectoSelected.notas_proyecto){
          this.new_notas_proyecto = this.proyectoSelected.notas_proyecto;
        }else{
          this.new_notas_proyecto = "";
        }
        notas_proyecto.setAttribute('class','collapse');
        notasProyecto.setAttribute('colspan','5');
        btnAjusteProyecto.setAttribute('style','display:none');
      }
  }

  cancelarAjusteProyecto(){
    this.new_estado_proyecto = '';
    if(this.proyectoSelected.notas_proyecto){
      this.new_notas_proyecto = this.proyectoSelected.notas_proyecto;
    }else{
      this.new_notas_proyecto = "";
    }
    let notasProyecto = (document.getElementById("notasProyecto")) as HTMLElement;
    let btnAjusteProyecto = (document.getElementById("btnAjusteProyecto")) as HTMLElement;
    let notas_proyecto = (document.getElementById("notas_proyecto")) as HTMLElement;
    btnAjusteProyecto.setAttribute('style','display:none');
    notas_proyecto.setAttribute('class','collapse');
    notasProyecto.setAttribute('colspan','5');
    if(this.proyectoSelected.estado_proyecto !== "Enviado") {
      let ajusteProyecto = (document.getElementById('ajusteProyecto')) as HTMLButtonElement;
      let cancelarAjusteProyecto = (document.getElementById('cancelarAjusteProyecto')) as HTMLButtonElement;
      ajusteProyecto.setAttribute('style', 'display:block');
      btnAjusteProyecto.setAttribute('style', 'display:none;');
    }
  }

  getProyectoSelected(data: any) {
    this.proyectoSelected = data;
    if(this.proyectoSelected.notas_propuesta){
      this.new_notas_inscripcion = this.proyectoSelected.notas_propuesta;
    }else{
      this.new_notas_inscripcion = "";
    }
    if(this.proyectoSelected.notas_anteproyecto){
      this.new_notas_anteproyecto = this.proyectoSelected.notas_anteproyecto;
    }else{
      this.new_notas_anteproyecto = "";
    }
    if(this.proyectoSelected.notas_proyecto){
      this.new_notas_proyecto = this.proyectoSelected.notas_proyecto;
    }else{
      this.new_notas_proyecto = "";
    }
  }

  resetProyecto(){
    this.new_estado_inscripcion = "";
    this.new_estado_anteproyecto = "";
    this.new_estado_proyecto = "";

    this.new_notas_inscripcion = "";
    this.new_notas_anteproyecto = "";
    this.new_notas_proyecto = "";

    //reset inscripcion
    if(this.proyectoSelected.estado_propuesta){
      let notasInscripcion = (document.getElementById("notasInscripcion")) as HTMLElement;
      let btnAjusteInscripcion = (document.getElementById("btnAjusteInscripcion")) as HTMLElement;
      let notas_propuesta = (document.getElementById("notas_propuesta")) as HTMLElement;
      notasInscripcion.setAttribute('colspan','5');
      btnAjusteInscripcion.setAttribute('style','display:none');
      notas_propuesta.setAttribute('class','collapse');
      if(this.proyectoSelected.estado_propuesta === "Aprobada") {
        let cancelarAjusteInscripcion = (document.getElementById('cancelarAjusteInscripcion')) as HTMLButtonElement;
        let ajusteInscripcion = (document.getElementById('ajusteInscripcion')) as HTMLButtonElement;
        cancelarAjusteInscripcion.setAttribute('style', 'display:none;');
        ajusteInscripcion.setAttribute('style', 'display:block;');
      }
    }
    //reset anteproyecto
    if(this.proyectoSelected.estado_anteproyecto){
      let notasAnteproyecto = (document.getElementById("notasAnteproyecto")) as HTMLElement;
      let notas_anteproyecto = (document.getElementById("notas_anteproyecto")) as HTMLElement;
      let btnAjusteAnteproyecto = (document.getElementById("btnAjusteAnteproyecto")) as HTMLElement;
      notasAnteproyecto.setAttribute('colspan','5');
      btnAjusteAnteproyecto.setAttribute('style','display:none');
      notas_anteproyecto.setAttribute('class','collapse');
      if(this.proyectoSelected.estado_anteproyecto === "Aprobado") {
        let cancelarAjusteAnteproyecto = (document.getElementById('cancelarAjusteAnteproyecto')) as HTMLButtonElement;
        let ajusteAnteproyecto = (document.getElementById('ajusteAnteproyecto')) as HTMLButtonElement;
        cancelarAjusteAnteproyecto.setAttribute('style', 'display:none;');
        ajusteAnteproyecto.setAttribute('style', 'display:block;');
      }
    }
    //reset proyecto
    if(this.proyectoSelected.estado_proyecto){
      let notasProyecto = (document.getElementById("notasProyecto")) as HTMLElement;
      let notas_proyecto = (document.getElementById("notas_proyecto")) as HTMLElement;
      let btnAjusteProyecto = (document.getElementById("btnAjusteProyecto")) as HTMLElement;
      notasProyecto.setAttribute('colspan','5');
      btnAjusteProyecto.setAttribute('style','display:none');
      notas_proyecto.setAttribute('class','collapse');
      if(this.proyectoSelected.estado_proyecto === "Aprobado") {
        let btnAjusteProyecto = (document.getElementById('btnAjusteProyecto')) as HTMLButtonElement;
        let ajusteProyecto = (document.getElementById('ajusteProyecto')) as HTMLButtonElement;
        btnAjusteProyecto.setAttribute('style', 'display:none;');
        ajusteProyecto.setAttribute('style', 'display:block;');
      }
    }   
  }

  getPasantias() {
    const user  = JSON.parse(localStorage.getItem('user'));
    this._pasantiaService.getSolicitudesTutor(user._id).subscribe((resp: any) => {
      this.pasantias = resp.pasantias;
      let currentDate = new Date();
      let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
      for (let i = 0; i < this.pasantias.length; i++) {
        if(this.pasantias[i].fecha_actaInicio){
          let fechaInicio = new Date(Date.parse(this.pasantias[i].fecha_actaInicio));
          this.pasantias[i].fecha_actaInicio =  fechaInicio.getDate()+" de "+meses[fechaInicio.getMonth()]+" del "+fechaInicio.getFullYear(); 
          let diff = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate()) ) /(1000 * 60 * 60 * 24 * 7));
          if(Math.floor(diff) === 0){
            this.pasantias[i].semanas = 1;
          }else if(Math.floor(diff) > 0 && Math.floor(diff) <= 24){
            this.pasantias[i].semanas = Math.floor(diff);
          }else{
            this.pasantias[i].semanas = 24;
          }
        }
      }
    })
  }

  putEstadoInformes(idPasantia: string) {
    Swal.fire({
      title: '¿Actualizar Pasantía?',
      icon: 'warning',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si',
      showCancelButton: true,
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.value) {
        let pasantiaUpdate:any = {}
        if(this.new_estado_propuesta !== ""){
          pasantiaUpdate.estado_propuesta = this.new_estado_propuesta;
        }
        if(this.new_estado_actaInicio !== ""){
          pasantiaUpdate.estado_actaInicio = this.new_estado_actaInicio;
        } 
        if(this.new_estado_informe7 !== ""){
          pasantiaUpdate.estado_informe7 = this.new_estado_informe7;
        } 
        if(this.new_estado_informe14 !== ""){
          pasantiaUpdate.estado_informe14 = this.new_estado_informe14;
        } 
        if(this.new_estado_informeFinal !== ""){
          pasantiaUpdate.estado_informeFinal = this.new_estado_informeFinal;
        }
        if(this.new_notas_propuesta !== ""){
          pasantiaUpdate.notas_propuesta = this.new_notas_propuesta;
        }
        if(this.new_notas_actaInicio !== ""){
          pasantiaUpdate.notas_actaInicio = this.new_notas_actaInicio;
        } 
        if(this.new_notas_informe7 !== ""){
          pasantiaUpdate.notas_informe7 = this.new_notas_informe7;
        } 
        if(this.new_notas_informe14 !== ""){
          pasantiaUpdate.notas_informe14 = this.new_notas_informe14;
        } 
        if(this.new_notas_informeFinal !== ""){
          pasantiaUpdate.notas_informeFinal = this.new_notas_informeFinal;
        }
        let txtAprobado:string  = "";
        let txtAjustar:string  = "";  
        if(
          this.new_estado_propuesta === "Aprobada" ||
          this.new_estado_actaInicio === "Aprobada" || 
          this.new_estado_informe7 === "Aprobado" ||
          this.new_estado_informe14  === "Aprobado" ||
          this.new_estado_informeFinal  === "Aprobado"
        ){
          txtAprobado = "Documentos aprobados:";
          if(this.new_estado_propuesta === "Aprobada"){
            txtAprobado = `${txtAprobado}
              - Propuesta`;
          }
          if(this.new_estado_actaInicio === "Aprobada"){
            txtAprobado = `${txtAprobado}
              - Acta de inicio`;
          }  
          if(this.new_estado_informe7 === "Aprobado"){
            txtAprobado = `${txtAprobado}
              - Informe de la semana 7`;
          }  
          if(this.new_estado_informe14 === "Aprobado"){
            txtAprobado = `${txtAprobado}
              - Informe de la semana 14`;
          }
          if(this.new_estado_informeFinal === "Aprobado"){
            txtAprobado = `${txtAprobado}
              - Informe final`;
          }
        }   
        if(
          this.new_estado_propuesta === "Ajustar" ||
          this.new_estado_actaInicio === "Ajustar" || 
          this.new_estado_informe7 === "Ajustar" ||
          this.new_estado_informe14  === "Ajustar" ||
          this.new_estado_informeFinal  === "Ajustar"
        ){
          txtAjustar = "Documentos por ajustar:";
          if(this.new_estado_propuesta === "Ajustar"){
            txtAjustar = `${txtAjustar}
              - Propuesta`;
          }
          if(this.new_estado_actaInicio === "Ajustar"){
            txtAjustar = `${txtAjustar}
              - Acta de inicio`;
          }  
          if(this.new_estado_informe7 === "Ajustar"){
            txtAjustar = `${txtAjustar}
              - Informe de la semana 7`;
          }  
          if(this.new_estado_informe14 === "Ajustar"){
            txtAjustar = `${txtAjustar}
              - Informe de la semana 14`;
          }
          if(this.new_estado_informeFinal === "Ajustar"){
            txtAjustar = `${txtAjustar}
              - Informe final`;
          }          
        }  
        const btnCloseModalGestion = (document.getElementById("btnCloseModalGestion")) as HTMLElement;
        btnCloseModalGestion.click();
        this.resetDataInfo();
        Swal.fire({
          title: 'Por favor espera!',
          html: '<b></b>',
          allowEnterKey: false,
          allowEscapeKey: false,
          allowOutsideClick: false,
          showCancelButton: false,
          showCloseButton: false,
          showConfirmButton:false,
          timer: 1000*60*2,
          timerProgressBar: true,
          onOpen: () => {
            Swal.showLoading();
            const content = Swal.getHtmlContainer();
            const b = content.querySelector('b');
            b.textContent = "Guardando cambios";
            this._pasantiaService.putSolicitudTutor(idPasantia, pasantiaUpdate).subscribe(async(resp:any)=>{
              const fechaActual = new Date();
              let txt = "";
              if(txtAprobado ! == "" && txtAjustar !== ""){
                txt = `${txtAprobado}
                    ${txtAjustar}`;
              }else if(txtAprobado !== ""){
                txt = txtAprobado;
              }else if(txtAjustar !== ""){
                txt = txtAjustar;
              }
              if(resp.estado === "Sustentación"){
                txt = `${txt}
                Queda pendiente que el jefe de programa te asigne los jurados, la fecha y lugar de la sustentación`;
                let notiJefe = new Notificacion(
                  this.jefe._id,
                  fechaActual,
                  "Pasantia pendiente de sustentación",
                  `La pasantia: '${resp.titulo}' ha sido aprobada por su director y queda pendiente de asignación de jurados y sustentación`,
                  "Estudiante",
                  this.jefe.correo
                );
                b.textContent = "Enviando notificación al jefe de programa";
                await this._notificacionService.postNotificacion(notiJefe).toPromise();
                await this._notificacionService.sendNotificacionCorreo(notiJefe).toPromise();
              }else{
                if(txt !== ""){
                  let notiE = new Notificacion(
                    this.pasantiaSelected.estudiante._id,
                    fechaActual,
                    "Tu director ha calificado el proyecto",
                    txt,
                    "Estudiante",
                    this.pasantiaSelected.estudiante.correo
                  );
                  b.textContent = "Enviando notificación al estudiante";
                  await this._notificacionService.postNotificacion(notiE).toPromise();
                  await this._notificacionService.sendNotificacionCorreo(notiE).toPromise();
                }
              }
              Swal.close()
              Swal.fire({
                title: '¡Bien hecho!',
                text: 'Pasantia actualizada correctamente',
                icon: 'success',
                showConfirmButton: false,
                showCancelButton: false,
                showCloseButton:false,
                allowEnterKey: false,
                allowEscapeKey: false,
                allowOutsideClick: false,
                timer: 1000,
                timerProgressBar: false     
              }).then(() => {
                this.getPasantias();
              });
            });
          }
        });
      }
    })

  }

  ajustePropuesta(){
    this.new_estado_propuesta = 'Ajustar';
    let notasPropuesta = (document.getElementById("notasPropuesta")) as HTMLElement;
    let btnAjustePropuesta = (document.getElementById("btnAjustePropuesta")) as HTMLElement;
    let notas_propuesta = (document.getElementById("notas_propuesta")) as HTMLElement;
    notasPropuesta.setAttribute('colspan','5');
    btnAjustePropuesta.setAttribute('style','display:none');
    notas_propuesta.setAttribute('class','collapse');
    if(this.pasantiaSelected.estado_propuesta !== "Enviada") {
      let cancelarAjustePropuesta = (document.getElementById('cancelarAjustePropuesta')) as HTMLButtonElement;
      cancelarAjustePropuesta.setAttribute('style', 'display:block; color: #8F141B');
    }
  }

  notasPropuesta(){
    let notasPropuesta = (document.getElementById("notasPropuesta")) as HTMLElement;
    let notas_propuesta = (document.getElementById("notas_propuesta")) as HTMLElement;
    let btnAjustePropuesta = (document.getElementById("btnAjustePropuesta")) as HTMLElement;
    if(this.pasantiaSelected?.estado_propuesta === 'Aprobada'){
      let ajustePropuesta = (document.getElementById('ajustePropuesta')) as HTMLButtonElement;
      notasPropuesta.setAttribute('colspan','4');
      notas_propuesta.setAttribute('class','collapse show');
      btnAjustePropuesta.setAttribute('style','display:block');
      ajustePropuesta.setAttribute('style', 'display:none');
    }else if(this.new_estado_propuesta === 'Ajustar'){
      notasPropuesta.setAttribute('colspan','4');
      notas_propuesta.setAttribute('class','collapse show');
      btnAjustePropuesta.setAttribute('style','display:block');
    }else{
      this.new_notas_propuesta = '';
      notasPropuesta.setAttribute('colspan','5');
      notas_propuesta.setAttribute('class','collapse');
      btnAjustePropuesta.setAttribute('style','display:none');
    }
  }

  cancelarAjustePropuesta(){
    this.new_estado_propuesta = '';
    this.new_notas_propuesta = '';
    let notasPropuesta = (document.getElementById("notasPropuesta")) as HTMLElement;
    let btnAjustePropuesta = (document.getElementById("btnAjustePropuesta")) as HTMLElement;
    let notas_propuesta = (document.getElementById("notas_propuesta")) as HTMLElement;
    notasPropuesta.setAttribute('colspan','5');
    btnAjustePropuesta.setAttribute('style','display:none');
    notas_propuesta.setAttribute('class','collapse');
    if(this.pasantiaSelected.estado_propuesta !== "Enviada") {
      let ajustePropuesta = (document.getElementById('ajustePropuesta')) as HTMLButtonElement;
      let cancelarAjustePropuesta = (document.getElementById('cancelarAjustePropuesta')) as HTMLButtonElement;
      ajustePropuesta.setAttribute('style', 'display:block');
      cancelarAjustePropuesta.setAttribute('style', 'display:none;');
    }
  }

  ajusteActaInicio(){
    this.new_estado_actaInicio = 'Ajustar';
    let notasActaInicio = (document.getElementById("notasActaInicio")) as HTMLElement;
    let notas_actaInicio = (document.getElementById("notas_actaInicio")) as HTMLElement;
    let btnAjusteActaInicio = (document.getElementById("btnAjusteActaInicio")) as HTMLElement;
    notasActaInicio.setAttribute('colspan','5');
    btnAjusteActaInicio.setAttribute('style','display:none');
    notas_actaInicio.setAttribute('class','collapse');
    if(this.pasantiaSelected.estado_actaInicio !== "Enviada") {
      let cancelarAjusteActaInicio = (document.getElementById('cancelarAjusteActaInicio')) as HTMLButtonElement;
      cancelarAjusteActaInicio.setAttribute('style', 'display:block; color: #8F141B');
    }
  }

  notasActaInicio(){
      let notasActaInicio = (document.getElementById("notasActaInicio")) as HTMLElement;
      let notas_actaInicio = (document.getElementById("notas_actaInicio")) as HTMLElement;
      let btnAjusteActaInicio = (document.getElementById("btnAjusteActaInicio")) as HTMLElement;
      if(this.pasantiaSelected?.estado_actaInicio === 'Aprobada'){
        let ajusteActaInicio = (document.getElementById('ajusteActaInicio')) as HTMLButtonElement;
        notasActaInicio.setAttribute('colspan','4')
        notas_actaInicio.setAttribute('class','collapse show');
        btnAjusteActaInicio.setAttribute('style','display:block');
        ajusteActaInicio.setAttribute('style', 'display:none');
      }else if(this.new_estado_actaInicio === 'Ajustar'){
        notasActaInicio.setAttribute('colspan','4');
        notas_actaInicio.setAttribute('class','collapse show');
        btnAjusteActaInicio.setAttribute('style','display:block');
      }else{
        this.new_notas_actaInicio = '';
        notas_actaInicio.setAttribute('class','collapse');
        notasActaInicio.setAttribute('colspan','5');
        btnAjusteActaInicio.setAttribute('style','display:none');
      }
  }

  cancelarAjusteActaInicio(){
    this.new_estado_actaInicio = '';
    this.new_notas_actaInicio = '';
    let notasActaInicio = (document.getElementById("notasActaInicio")) as HTMLElement;
    let btnAjusteActaInicio = (document.getElementById("btnAjusteActaInicio")) as HTMLElement;
    let notas_actaInicio = (document.getElementById("notas_actaInicio")) as HTMLElement;
    btnAjusteActaInicio.setAttribute('style','display:none');
    notas_actaInicio.setAttribute('class','collapse');
    notasActaInicio.setAttribute('colspan','5');
    if(this.pasantiaSelected.estado_actaInicio !== "Enviada") {
      let ajusteActaInicio = (document.getElementById('ajusteActaInicio')) as HTMLButtonElement;
      let cancelarAjusteActaInicio = (document.getElementById('cancelarAjusteActaInicio')) as HTMLButtonElement;
      ajusteActaInicio.setAttribute('style', 'display:block');
      cancelarAjusteActaInicio.setAttribute('style', 'display:none;');
    }
  }

  ajusteInfome7(){
    this.new_estado_informe7 = 'Ajustar';
    let notasSemana7 = (document.getElementById("notasSemana7")) as HTMLElement;
    let notas_informe7 = (document.getElementById("notas_informe7")) as HTMLElement;
    let btnAjusteInforme7 = (document.getElementById("btnAjusteInforme7")) as HTMLElement;
    notasSemana7.setAttribute('colspan','5');
    btnAjusteInforme7.setAttribute('style','display:none');
    notas_informe7.setAttribute('class','collapse');
    if(this.pasantiaSelected.estado_informe7 !== "Enviada") {
      let cancelarAjusteInforme7 = (document.getElementById('cancelarAjusteInforme7')) as HTMLButtonElement;
      cancelarAjusteInforme7.setAttribute('style', 'display:block; color: #8F141B');
    }
  }

  notasInforme7(){
      let notasSemana7 = (document.getElementById("notasSemana7")) as HTMLElement;
      let notas_informe7 = (document.getElementById("notas_informe7")) as HTMLElement;
      let btnAjusteInforme7 = (document.getElementById("btnAjusteInforme7")) as HTMLElement;
      if(this.pasantiaSelected?.estado_informe7 === 'Aprobado'){
        let ajusteInforme7 = (document.getElementById('ajusteInforme7')) as HTMLButtonElement;
        notasSemana7.setAttribute('colspan','4')
        notas_informe7.setAttribute('class','collapse show');
        btnAjusteInforme7.setAttribute('style','display:block');
        ajusteInforme7.setAttribute('style', 'display:none');
      }else if(this.new_estado_informe7 === 'Ajustar'){
        notasSemana7.setAttribute('colspan','4');
        notas_informe7.setAttribute('class','collapse show');
        btnAjusteInforme7.setAttribute('style','display:block');
      }else{
        this.new_notas_informe7 = '';
        notas_informe7.setAttribute('class','collapse');
        notasSemana7.setAttribute('colspan','5');
        btnAjusteInforme7.setAttribute('style','display:none');
      }
  }

  cancelarAjusteInforme7(){
    this.new_estado_informe7 = '';
    this.new_notas_informe7 = '';
    let notasSemana7 = (document.getElementById("notasSemana7")) as HTMLElement;
    let btnAjusteInforme7 = (document.getElementById("btnAjusteInforme7")) as HTMLElement;
    let notas_informe7 = (document.getElementById("notas_informe7")) as HTMLElement;
    btnAjusteInforme7.setAttribute('style','display:none');
    notas_informe7.setAttribute('class','collapse');
    notasSemana7.setAttribute('colspan','5');
    if(this.pasantiaSelected.estado_informe7 !== "Enviada") {
      let ajusteInforme7 = (document.getElementById('ajusteInforme7')) as HTMLButtonElement;
      let cancelarAjusteInforme7 = (document.getElementById('cancelarAjusteInforme7')) as HTMLButtonElement;
      ajusteInforme7.setAttribute('style', 'display:block');
      cancelarAjusteInforme7.setAttribute('style', 'display:none;');
    }
  }

  ajusteInfome14(){
    this.new_estado_informe14 = 'Ajustar';
    let notasSemana14 = (document.getElementById("notasSemana14")) as HTMLElement;
    let notas_informe14 = (document.getElementById("notas_informe14")) as HTMLElement;
    let btnAjusteInforme14 = (document.getElementById("btnAjusteInforme14")) as HTMLElement;
    notasSemana14.setAttribute('colspan','5');
    btnAjusteInforme14.setAttribute('style','display:none');
    notas_informe14.setAttribute('class','collapse');
    if(this.pasantiaSelected.estado_informe14 !== "Enviada") {
      let cancelarAjusteInforme14 = (document.getElementById('cancelarAjusteInforme14')) as HTMLButtonElement;
      cancelarAjusteInforme14.setAttribute('style', 'display:block; color: #8F141B');
    }
  }

  notasInforme14(){
      let notasSemana14 = (document.getElementById("notasSemana14")) as HTMLElement;
      let notas_informe14 = (document.getElementById("notas_informe14")) as HTMLElement;
      let btnAjusteInforme14 = (document.getElementById("btnAjusteInforme14")) as HTMLElement;
      if(this.pasantiaSelected?.estado_informe14 === 'Aprobado'){
        let ajusteInforme14 = (document.getElementById('ajusteInforme14')) as HTMLButtonElement;
        notasSemana14.setAttribute('colspan','4')
        notas_informe14.setAttribute('class','collapse show');
        btnAjusteInforme14.setAttribute('style','display:block');
        ajusteInforme14.setAttribute('style', 'display:none');
      }else if(this.new_estado_informe14 === 'Ajustar'){
        notasSemana14.setAttribute('colspan','4');
        notas_informe14.setAttribute('class','collapse show');
        btnAjusteInforme14.setAttribute('style','display:block');
      }else{
        this.new_notas_informe14 = '';
        notas_informe14.setAttribute('class','collapse');
        notasSemana14.setAttribute('colspan','5');
        btnAjusteInforme14.setAttribute('style','display:none');
      }
  }

  cancelarAjusteInforme14(){
    this.new_estado_informe14 = '';
    this.new_notas_informe14 = '';
    let notasSemana14 = (document.getElementById("notasSemana14")) as HTMLElement;
    let btnAjusteInforme14 = (document.getElementById("btnAjusteInforme14")) as HTMLElement;
    let notas_informe14 = (document.getElementById("notas_informe14")) as HTMLElement;
    btnAjusteInforme14.setAttribute('style','display:none');
    notas_informe14.setAttribute('class','collapse');
    notasSemana14.setAttribute('colspan','5');
    if(this.pasantiaSelected.estado_informe14 !== "Enviada") {
      let ajusteInforme14 = (document.getElementById('ajusteInforme14')) as HTMLButtonElement;
      let cancelarAjusteInforme14 = (document.getElementById('cancelarAjusteInforme14')) as HTMLButtonElement;
      ajusteInforme14.setAttribute('style', 'display:block');
      cancelarAjusteInforme14.setAttribute('style', 'display:none;');
    }
  }

  ajusteInfomeFinal(){
    this.new_estado_informeFinal = 'Ajustar';
    let notasSemanaFinal = (document.getElementById("notasSemanaFinal")) as HTMLElement;
    let notas_informeFinal = (document.getElementById("notas_informeFinal")) as HTMLElement;
    let btnAjusteInformeFinal = (document.getElementById("btnAjusteInformeFinal")) as HTMLElement;
    notasSemanaFinal.setAttribute('colspan','5');
    btnAjusteInformeFinal.setAttribute('style','display:none');
    notas_informeFinal.setAttribute('class','collapse');
    if(this.pasantiaSelected.estado_informeFinal !== "Enviada") {
      let cancelarAjusteInformeFinal = (document.getElementById('cancelarAjusteInformeFinal')) as HTMLButtonElement;
      cancelarAjusteInformeFinal.setAttribute('style', 'display:block; color: #8F141B');
    }
  }

  notasInformeFinal(){
      let notasSemanaFinal = (document.getElementById("notasSemanaFinal")) as HTMLElement;
      let notas_informeFinal = (document.getElementById("notas_informeFinal")) as HTMLElement;
      let btnAjusteInformeFinal = (document.getElementById("btnAjusteInformeFinal")) as HTMLElement;
      if(this.pasantiaSelected?.estado_informeFinal === 'Aprobado'){
        let ajusteInformeFinal = (document.getElementById('ajusteInformeFinal')) as HTMLButtonElement;
        notasSemanaFinal.setAttribute('colspan','4')
        notas_informeFinal.setAttribute('class','collapse show');
        btnAjusteInformeFinal.setAttribute('style','display:block');
        ajusteInformeFinal.setAttribute('style', 'display:none');
      }else if(this.new_estado_informeFinal === 'Ajustar'){
        notasSemanaFinal.setAttribute('colspan','4');
        notas_informeFinal.setAttribute('class','collapse show');
        btnAjusteInformeFinal.setAttribute('style','display:block');
      }else{
        this.new_notas_informeFinal = '';
        notas_informeFinal.setAttribute('class','collapse');
        notasSemanaFinal.setAttribute('colspan','5');
        btnAjusteInformeFinal.setAttribute('style','display:none');
      }
  }

  cancelarAjusteInformeFinal(){
    this.new_estado_informeFinal = '';
    this.new_notas_informeFinal = '';
    let notasSemanaFinal = (document.getElementById("notasSemanaFinal")) as HTMLElement;
    let btnAjusteInformeFinal = (document.getElementById("btnAjusteInformeFinal")) as HTMLElement;
    let notas_informeFinal = (document.getElementById("notas_informeFinal")) as HTMLElement;
    btnAjusteInformeFinal.setAttribute('style','display:none');
    notas_informeFinal.setAttribute('class','collapse');
    notasSemanaFinal.setAttribute('colspan','5');
    if(this.pasantiaSelected.estado_informeFinal !== "Enviada") {
      let ajusteInformeFinal = (document.getElementById('ajusteInformeFinal')) as HTMLButtonElement;
      let cancelarAjusteInformeFinal = (document.getElementById('cancelarAjusteInformeFinal')) as HTMLButtonElement;
      ajusteInformeFinal.setAttribute('style', 'display:block');
      cancelarAjusteInformeFinal.setAttribute('style', 'display:none;');
    }
  }

  getDataInfo(data: any) {
    this.pasantiaSelected = data;
    if(this.pasantiaSelected.notas_propuesta){
      this.new_notas_propuesta = this.pasantiaSelected.notas_propuesta;
    }else{
      this.new_notas_propuesta = "";
    }
    if(this.pasantiaSelected.notas_actaInicio){
      this.new_notas_actaInicio = this.pasantiaSelected.notas_actaInicio;
    }else{
      this.new_notas_actaInicio = "";
    }
    if(this.pasantiaSelected.notas_informe7){
      this.new_notas_informe7 = this.pasantiaSelected.notas_informe7;
    }else{
      this.new_notas_informe7 = "";
    }
    if(this.pasantiaSelected.notas_informe14){
      this.new_notas_informe14 = this.pasantiaSelected.notas_informe14;
    }else{
      this.new_notas_informe14 = "";
    }
    if(this.pasantiaSelected.notas_informeFinal){
      this.new_notas_informeFinal = this.pasantiaSelected.notas_informeFinal;
    }else{
      this.new_notas_informeFinal = "";
    }
  }

  resetDataInfo(){
    this.new_estado_propuesta = "";
    this.new_estado_actaInicio = "";
    this.new_estado_informe7 = "";
    this.new_estado_informe14 = "";
    this.new_estado_informeFinal = "";
    this.new_notas_propuesta = "";
    this.new_notas_actaInicio = "";
    this.new_notas_informe7 = "";
    this.new_notas_informe14 = "";
    this.new_notas_informeFinal = "";
    //reset propuesta
    if(this.pasantiaSelected.estado_propuesta){
      let notasPropuesta = (document.getElementById("notasPropuesta")) as HTMLElement;
      let btnAjustePropuesta = (document.getElementById("btnAjustePropuesta")) as HTMLElement;
      let notas_propuesta = (document.getElementById("notas_propuesta")) as HTMLElement;
      notasPropuesta.setAttribute('colspan','5');
      btnAjustePropuesta.setAttribute('style','display:none');
      notas_propuesta.setAttribute('class','collapse');
      if(this.pasantiaSelected.estado_propuesta === "Aprobada") {
        let cancelarAjustePropuesta = (document.getElementById('cancelarAjustePropuesta')) as HTMLButtonElement;
        let ajustePropuesta = (document.getElementById('ajustePropuesta')) as HTMLButtonElement;
        cancelarAjustePropuesta.setAttribute('style', 'display:none;');
        ajustePropuesta.setAttribute('style', 'display:block;');
      }
    }
    //reset acta inicio
    if(this.pasantiaSelected.estado_actaInicio){
      let notasActaInicio = (document.getElementById("notasActaInicio")) as HTMLElement;
      let notas_actaInicio = (document.getElementById("notas_actaInicio")) as HTMLElement;
      let btnAjusteActaInicio = (document.getElementById("btnAjusteActaInicio")) as HTMLElement;
      notasActaInicio.setAttribute('colspan','5');
      btnAjusteActaInicio.setAttribute('style','display:none');
      notas_actaInicio.setAttribute('class','collapse');
      if(this.pasantiaSelected.estado_actaInicio === "Aprobada") {
        let cancelarAjusteActaInicio = (document.getElementById('cancelarAjusteActaInicio')) as HTMLButtonElement;
        let ajusteActaInicio = (document.getElementById('ajusteActaInicio')) as HTMLButtonElement;
        cancelarAjusteActaInicio.setAttribute('style', 'display:none;');
        ajusteActaInicio.setAttribute('style', 'display:block;');
      }
    }
    if(this.pasantiaSelected.estado_informe7){
      let notasSemana7 = (document.getElementById("notasSemana7")) as HTMLElement;
      let notas_informe7 = (document.getElementById("notas_informe7")) as HTMLElement;
      let btnAjusteInforme7 = (document.getElementById("btnAjusteInforme7")) as HTMLElement;
      notasSemana7.setAttribute('colspan','5');
      btnAjusteInforme7.setAttribute('style','display:none');
      notas_informe7.setAttribute('class','collapse');
      if(this.pasantiaSelected.estado_informe7 === "Aprobado") {
        let cancelarAjusteInforme7 = (document.getElementById('cancelarAjusteInforme7')) as HTMLButtonElement;
        let ajusteInforme7 = (document.getElementById('ajusteInforme7')) as HTMLButtonElement;
        cancelarAjusteInforme7.setAttribute('style', 'display:none;');
        ajusteInforme7.setAttribute('style', 'display:block;');
      }
    }
    if(this.pasantiaSelected.estado_informe14){
      let notasSemana14 = (document.getElementById("notasSemana14")) as HTMLElement;
      let notas_informe14 = (document.getElementById("notas_informe14")) as HTMLElement;
      let btnAjusteInforme14 = (document.getElementById("btnAjusteInforme14")) as HTMLElement;
      notasSemana14.setAttribute('colspan','5');
      btnAjusteInforme14.setAttribute('style','display:none');
      notas_informe14.setAttribute('class','collapse');
      if(this.pasantiaSelected.estado_informe14 === "Aprobado") {
        let cancelarAjusteInforme14 = (document.getElementById('cancelarAjusteInforme14')) as HTMLButtonElement;
        let ajusteInforme14 = (document.getElementById('ajusteInforme14')) as HTMLButtonElement;
        cancelarAjusteInforme14.setAttribute('style', 'display:none;');
        ajusteInforme14.setAttribute('style', 'display:block;');
      }
    }
    if(this.pasantiaSelected.estado_informeFinal){
      let notasSemanaFinal = (document.getElementById("notasSemanaFinal")) as HTMLElement;
      let notas_informeFinal = (document.getElementById("notas_informeFinal")) as HTMLElement;
      let btnAjusteInformeFinal = (document.getElementById("btnAjusteInformeFinal")) as HTMLElement;
      notasSemanaFinal.setAttribute('colspan','5');
      btnAjusteInformeFinal.setAttribute('style','display:none');
      notas_informeFinal.setAttribute('class','collapse');
      if(this.pasantiaSelected.estado_informeFinal === "Aprobado") {
        let cancelarAjusteInformeFinal = (document.getElementById('cancelarAjusteInformeFinal')) as HTMLButtonElement;
        let ajusteInformeFinal = (document.getElementById('ajusteInformeFinal')) as HTMLButtonElement;
        cancelarAjusteInformeFinal.setAttribute('style', 'display:none;');
        ajusteInformeFinal.setAttribute('style', 'display:block;');
      }
    }      
  }

}