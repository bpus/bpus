import { Component, OnInit } from '@angular/core';
import { NotificacionesService, ProyectoService, AdministrativoService, PasantiService, ProgramaService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';
import { Notificacion } from 'src/app/models/notificacion.model';
import { NgForm } from '@angular/forms';
import { PasantiaAdmin } from 'src/app/models/PasantiaAdmin';
import {Img, PdfMakeWrapper, Table, Txt } from 'pdfmake-wrapper';

@Component({
  selector: 'app-propuestas',
  templateUrl: './propuestas.component.html'
})
export class PropuestasComponent implements OnInit {

  user  = JSON.parse(localStorage.getItem('user'));
  proyectos:any[];
  proyectoSelected:any
  notasProyecto:string;
  directores:any;
  director:string = "";
  directorValid = false
  directorSelected:any;

  pasantiaSelected: any;
  programa: String;
  pasantias: any[];
  tutorSelected: any;
  notasPasantia:string;
  carta_presentacion = new FormData();

  constructor(private _proyectoService: ProyectoService,
    private _pasantiaService: PasantiService,  
    private _tutoresService: AdministrativoService,
    private _programaService: ProgramaService,
    private _notificacionService: NotificacionesService) { }

  ngOnInit(): void {
    this.getPrograma();
    this.getPasantias();
    this.getProyectos();
    this.getDirectores();
  }

  getDirectores() {
    this._tutoresService.getTutores(this.user.programa).subscribe((resp: any) => {
      this.directores = resp.admins;
    });
  }

  getProyectos() {
    this._proyectoService.getProyectoEnviados(this.user.programa).subscribe((resp: any) => {
      this.proyectos = resp.proyectos;
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

  rechazarProyecto(form: NgForm){
    let proyecto:any = {estado: "Ajustar", estado_propuesta: "Ajustar", notas: this.notasProyecto};
    const btnCloseRechazar = (document.getElementById('btnCloseRechazar')) as HTMLButtonElement;
    btnCloseRechazar.click();
    Swal.fire({
      title: 'Por favor espera!',
      html: '<b></b>',
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      showCancelButton: false,
      showCloseButton: false,
      showConfirmButton:false,
      timer: 60000,
      timerProgressBar: false,
      onOpen: () => {
        Swal.showLoading();
        const content = Swal.getHtmlContainer();
        const b = content.querySelector('b');
        b.textContent = "Rechazando propuesta"
        this._proyectoService.putJefeProyecto(this.proyectoSelected._id, proyecto).subscribe(async(resp:any)=>{
          if(resp){
            const fechaActual = new Date();
            let notiE = new Notificacion(
              this.proyectoSelected.estudiante._id,
              fechaActual,
              "propuesta del proyecto rechazada",
              `La propuesta del proyecto ha sido rechazada, por favor ajustala`,
              "Estudiante",
              this.proyectoSelected.estudiante.correo
            );
            b.textContent = "Enviando notificación a "+this.proyectoSelected.estudiante.nombres+" "+this.proyectoSelected.estudiante.apellidos;
            await this._notificacionService.postNotificacion(notiE).toPromise();
            await this._notificacionService.sendNotificacionCorreo(notiE).toPromise();
            if(this.proyectoSelected.estudiante2){
              notiE.receptor = this.proyectoSelected.estudiante2._id;
              notiE.receptorCorreo = this.proyectoSelected.estudiante2.correo;
              b.textContent = "Enviando notificación a "+this.proyectoSelected.estudiante2.nombres+" "+this.proyectoSelected.estudiante2.apellidos;
              await this._notificacionService.postNotificacion(notiE).toPromise();
              await this._notificacionService.sendNotificacionCorreo(notiE).toPromise();
            }
            if(this.proyectoSelected.estudiante3){
              notiE.receptor = this.proyectoSelected.estudiante3._id;
              notiE.receptorCorreo = this.proyectoSelected.estudiante3.correo;
              b.textContent = "Enviando notificación a "+this.proyectoSelected.estudiante3.nombres+" "+this.proyectoSelected.estudiante.apellidos;;
              await this._notificacionService.postNotificacion(notiE).toPromise();
              await this._notificacionService.sendNotificacionCorreo(notiE).toPromise();
            }
          }
          Swal.close();
        });
      },
      onClose: () => {
        Swal.fire({
          title: '¡Bien Hecho!',
          html: "Propuesta rechazada correctamente",
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
        this.notasProyecto = "";
        this.directorSelected = "";
        this.director = "";
        this.directorValid = false;
        });
      }
    }).then(() => {
      this.getProyectos();
      this.notasProyecto = "";
      this.directorSelected = "";
      this.director = "";
      this.directorValid = false;
    });
  }
    
  aprobarProyecto(form: NgForm){
    let proyecto:any = {estado: "En ejecución"};
    if(this.directorSelected._id !== this.proyectoSelected.director._id){
      proyecto.director = this.directorSelected._id;
    }
    if(this.notasProyecto !== ""){
      proyecto.notas = this.notasProyecto;
    }
    const btnCloseAprobar = (document.getElementById('btnCloseAprobar')) as HTMLButtonElement;
    btnCloseAprobar.click();
    Swal.fire({
      title: 'Por favor espera!',
      html: '<b></b>',
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      showCancelButton: false,
      showCloseButton: false,
      showConfirmButton:false,
      timer: 1000*60*3,
      timerProgressBar: false,
      onOpen: () => {
        Swal.showLoading();
        const content = Swal.getHtmlContainer();
        const b = content.querySelector('b');
        b.textContent = "Aprobando proyecto";
        this._proyectoService.putJefeProyecto(this.proyectoSelected._id, proyecto).subscribe(async(resp:any)=>{
          if(resp){
            const fechaActual = new Date();
            let notiE = new Notificacion(
              this.proyectoSelected.estudiante._id,
              fechaActual,
              "Propuesta del proyecto aprobada",
              `La propuesta de tu proyecto ha sido aprobada y tu director será ${this.directorSelected.nombres} ${this.directorSelected.apellidos}`,
              "Estudiante",
              this.proyectoSelected.estudiante.correo
            );
            b.textContent = "Enviando notificación a "+this.proyectoSelected.estudiante.nombres+" "+this.proyectoSelected.estudiante.apellidos;;
            await this._notificacionService.postNotificacion(notiE).toPromise();
            await this._notificacionService.sendNotificacionCorreo(notiE).toPromise();
            if(this.proyectoSelected.estudiante2){
              notiE.receptor = this.proyectoSelected.estudiante2._id;
              notiE.receptorCorreo = this.proyectoSelected.estudiante2.correo;
              b.textContent = "Enviando notificación a "+this.proyectoSelected.estudiante2.nombres+" "+this.proyectoSelected.estudiante2.apellidos;;
              await this._notificacionService.postNotificacion(notiE).toPromise();
              await this._notificacionService.sendNotificacionCorreo(notiE).toPromise();
            }
            if(this.proyectoSelected.estudiante3){
              notiE.receptor = this.proyectoSelected.estudiante3._id;
              notiE.receptorCorreo = this.proyectoSelected.estudiante3.correo;
              b.textContent = "Enviando notificación a "+this.proyectoSelected.estudiante3.nombres+" "+this.proyectoSelected.estudiante3.apellidos;;
              await this._notificacionService.postNotificacion(notiE).toPromise();
              await this._notificacionService.sendNotificacionCorreo(notiE).toPromise();
            }
            let estudiante = this.proyectoSelected.estudiante.nombres+" "+this.proyectoSelected.estudiante.apellidos;
            let txt = "el estudiante";
            if(this.proyectoSelected.estudiante2 && !this.proyectoSelected.estudiante3){
              txt = "los estudiantes";
              estudiante = estudiante+" y "+this.proyectoSelected.estudiante2.nombres+" "+this.proyectoSelected.estudiante2.apellidos;
            }else if(this.proyectoSelected.estudiante2 && this.proyectoSelected.estudiante3){
              estudiante = estudiante+", "+this.proyectoSelected.estudiante2.nombres+" "+this.proyectoSelected.estudiante2.apellidos;
            }
            if(this.proyectoSelected.estudiante3){
              estudiante = estudiante+" y "+this.proyectoSelected.estudiante3.nombres+" "+this.proyectoSelected.estudiante3.apellidos
            }
            let notificacion = new Notificacion(
              this.directorSelected._id,
              fechaActual,
              'Asignación de director de proyecto de grado',
              `Te han asignado como director del proyecto de grado de ${txt} ${estudiante}`,
              'Administrativo',
              this.directorSelected.correo);
            b.textContent = "Enviando notificación al diector";
            await this._notificacionService.postNotificacion(notificacion).toPromise();
            await this._notificacionService.sendCorreoProyectoArchivo(this.proyectoSelected.documento_propuesta, this.proyectoSelected._id, notificacion).toPromise();
            Swal.close();
          }
        });
      },
      onClose: () => {
        Swal.fire({
          title: '¡Bien Hecho!',
          html: "Proyecto aprobado correctamente",
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
        this.escoderNotasProyecto();
        this.notasProyecto = "";
        this.directorSelected = "";
        this.director = "";
        this.directorValid = false;
        });
      }
    }).then(() => {
      this.getProyectos();
      this.escoderNotasProyecto();
      this.notasProyecto = "";
      this.directorSelected = "";
      this.director = "";
      this.directorValid = false;
    });
  }

  getProyectoSelected(proyecto:any){
    this.notasProyecto = "";
    this.directorSelected = "";
    this.director = "";
    this.directorValid = false;
    this.proyectoSelected = proyecto;
  }

  escoderNotasProyecto(){
    const notasAprobarProyecto = document.getElementById("notasAprobarProyecto") as HTMLElement;
    notasAprobarProyecto.setAttribute("class", "collapse")
  }

  escoderNotasPasantia(){
    const notasAprobarPasantia = document.getElementById("notasAprobarPasantia") as HTMLElement;
    notasAprobarPasantia.setAttribute("class", "collapse")
  }

  getDirectorSelected(){
    var selectDirector = (document.getElementById("directorSelected")) as HTMLSelectElement;
    var selectedIndex = selectDirector.selectedIndex;

    if(selectedIndex > 0){
      selectedIndex = selectedIndex-1;
      this.directorSelected = this.directores[selectedIndex];
      this.directorValid = true;
    }else{
      this.directorSelected = "";
      this.directorValid = false;
    }
  }

  getDataBuscar(valor: string){}

  getPrograma(){
    this._programaService.getPrograma().subscribe((resp:any)=>{
      let infoPrograma = resp['programa'];
      this.programa = infoPrograma.nombre;
    });
  }

  aprobarSolicitud(form: NgForm) {

    let empresa: any;
    if(this.pasantiaSelected.vacante){
      empresa = this.pasantiaSelected.vacante.convenio.empresa;
    }else{
      empresa = this.pasantiaSelected.convenio.empresa;
    }
    let pasantia = new PasantiaAdmin(
      'En ejecución',
      this.tutorSelected._id,
      null,
      form.value.notas,
    )
    Swal.fire({
      title: 'Por favor espera!',
      html: '<b></b>',
      allowEnterKey: false,
      allowEscapeKey:false,
      allowOutsideClick:false,
      showCancelButton: false,
      showConfirmButton:false,
      showCloseButton:false,
      timer: 60000,
      timerProgressBar:false,
      onOpen:()=>{
        Swal.showLoading();
        const content = Swal.getHtmlContainer();
        const b = content.querySelector('b');
        b.textContent = "Aprobando propuesta";
        this._pasantiaService.putSolicitudJefe(this.pasantiaSelected._id, pasantia).subscribe((resp:any) => {
          let empresa: any;
          if(this.pasantiaSelected.vacante){
            empresa = this.pasantiaSelected.vacante.convenio.empresa;
          }else{
            empresa = this.pasantiaSelected.convenio.empresa;
          }
          const pdf = new PdfMakeWrapper();
          pdf.pageSize('A4');
          pdf.pageMargins([ 80, 100 , 80, 50 ]);
      
          let currentDate = new Date();
          var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
          let dateText = currentDate.getDate() + ' de '+ meses[currentDate.getMonth()] + ' de ' + currentDate.getFullYear();
          
          // HEADER
          var headerUsco = (document.getElementById('headerUsco')) as HTMLImageElement;
          var canvasHeader = (document.createElement('canvas')) as HTMLCanvasElement;
          canvasHeader.width = headerUsco.width;
          canvasHeader.height = 75;  
          canvasHeader.getContext('2d').drawImage(headerUsco, 0, 0, 595, 75);
          var imgHeader = canvasHeader.toDataURL('image/jpeg');
      
          new Img(imgHeader).build().then( imgHeader => {
            pdf.header(imgHeader);  
            pdf.add(new Txt('Neiva, '+dateText).margin([0, 40, 0, 0]).alignment('left').end);
            pdf.add(new Txt('Señores').margin([0, 30, 0, 0]).alignment('left').end);
            pdf.add(new Txt(empresa.nombre).alignment('left').end);
            pdf.add(new Txt(empresa.ciudad).alignment('left').end);
            pdf.add(new Txt('Cordial saludo.').margin([0, 20, 0, 0]).alignment('left').end);
            pdf.add(new Txt(`De acuerdo a las políticas institucionales y teniendo en cuenta que se realizó el Convenio de “Cooperación Académica para la Realización de Prácticas Académicas y Pasantías celebrado entre la Universidad Surcolombiana y ${empresa.nombre}", me permito presentar e informar que el estudiante cumple con los requisitos para realizar pasantías,`).margin([0, 20, 0, 0]).alignment('justify').end)
      
            pdf.add(new Table([
              [ new Txt('ÍTEM').alignment('center').end, new Txt('NOMBRE Y APELLIDOS').alignment('center').end, new Txt('CODIGO').alignment('center').end, new Txt('C.C.#').alignment('center').end],
              [ new Txt('1').alignment('center').end, new Txt(`${this.pasantiaSelected.estudiante.nombres} ${this.pasantiaSelected.estudiante.apellidos}`).alignment('center').end, new Txt(`${this.pasantiaSelected.estudiante.codigo}`).alignment('center').end, new Txt(`${this.pasantiaSelected.estudiante.identificacion}`).alignment('center').end]
            ]).margin([0, 20, 0, 0]).end);
      
            pdf.add(new Txt(`Estará supervisada por un delegado de la empresa y por docente ${this.tutorSelected.nombres} ${this.tutorSelected.apellidos}, e-mail ${this.tutorSelected.correo} Número del celular ${this.tutorSelected.telefono}, del programa, información que quedará registrada en el acta de inicio de la práctica`).margin([0, 20, 0, 0]).alignment('justify').end)
            pdf.add(new Txt('Agradeciendo la atención a la presente.').margin([0, 30, 0, 0]).alignment('justify').end);
            pdf.add(new Txt('Atentamente,').margin([0, 20, 0, 70]).alignment('justify').end)
            
            // FIRMA
            //var fimaJefe = (document.getElementById('firmaJefe')) as HTMLImageElement;
            //var canvas = (document.createElement('canvas')) as HTMLCanvasElement;
            //canvas.width = fimaJefe.width; 
            //canvas.height = fimaJefe.height; 
            //canvas.getContext('2d').drawImage(fimaJefe, 0, 0);
            //var img = canvas.toDataURL('image/jpeg');
      
            //new Img(img).build().then( img => {
            //pdf.add(img);      
              pdf.add(new Txt(this.user.nombres+''+this.user.apellidos).alignment('justify').end)
              pdf.add(new Txt('Jefe del programa de '+this.programa).alignment('justify').end)
      
              // Footer
              var footerUsco = (document.getElementById('footerUsco')) as HTMLImageElement;
              var canvasFooter = (document.createElement('canvas')) as HTMLCanvasElement;
              canvasFooter.width = footerUsco.width; 
              canvasFooter.height = 52; 
              canvasFooter.getContext('2d').drawImage(footerUsco, 0, 0, 595, 52);
              var imgFooter = canvasFooter.toDataURL('image/jpeg');
      
              new Img(imgFooter).build().then(imgFooter => {
                pdf.footer(imgFooter);
                pdf.create().getBlob((blop) =>{
                  b.textContent = "Subiendo carta de presentación";
                  this.carta_presentacion.append('carta_presentacion', blop, this.pasantiaSelected.estudiante._id+'-carta_presentacion.pdf');
                  this._pasantiaService.postCartaPresentacion(this.pasantiaSelected.estudiante._id, this.carta_presentacion).subscribe(async(respPC:any) => {
                    if(respPC){
                      let currentDate = new Date();
                      let notificacionE =new Notificacion(
                        this.pasantiaSelected.estudiante._id,
                        currentDate,
                        'Solicitud de pasantía aprobada',
                        `Tu solicitud de pasantía ha sido aprobada, el director de tu pasantía será ${this.tutorSelected.nombres} ${this.tutorSelected.apellidos}`,
                        'Estudiante',
                        this.pasantiaSelected.estudiante.correo);
                      b.textContent = "Enviando notificación al estudiante";
                      await this._notificacionService.postNotificacion(notificacionE).toPromise();
                      await this._notificacionService.sendCartaPresentacionCorreo(this.pasantiaSelected.estudiante._id, notificacionE).toPromise();
                      let notificacionT = new Notificacion(
                        this.tutorSelected._id,
                        currentDate,
                        'Asignación como director de pasantía',
                        `Te han asiganado como director de la pasantía del estudiante ${this.pasantiaSelected.estudiante.nombres} ${this.pasantiaSelected.estudiante.apellidos}`,
                        'Administrativo',
                        this.tutorSelected.correo);
                      b.textContent = "Enviando notificación al director";
                      await this._notificacionService.postNotificacion(notificacionT).toPromise();
                      await this._notificacionService.sendPropuestaCorreo(this.pasantiaSelected.estudiante._id, notificacionT).toPromise();
                      Swal.close();
                      Swal.fire({
                        title: '¡Bien Hecho!',
                        html: `Propuesta aprobada correctamente`,
                        icon: 'success',
                        allowEnterKey: false,
                        allowEscapeKey:false,
                        allowOutsideClick:false,
                        showCancelButton: false,
                        showConfirmButton:false,
                        showCloseButton:false,
                        timer: 1000,
                      }).then(() => {
                        const btnCloseAprobar = (document.getElementById('btnCloseAprobar')) as HTMLButtonElement;
                        btnCloseAprobar.click();
                        this.getPasantias();
                      });
                    }
                  });
                })
              //});
            });
          });
        });
      }
    });
  }

  rechazarSolicitud(form: NgForm){
    if(form.value.notas !== null){
      let pasantia = new PasantiaAdmin(
        "Ajustar",
        null,
        "Ajustar",
        form.value.notas,
      );
      let currentDate = new Date();
      let notificacionE =new Notificacion(
        this.pasantiaSelected.estudiante._id,
        currentDate,
        'Solicitud de pasantía rechazada',
        'Tu solicitud de pasantía ha sido rechazada, por favor ajustala',
        'Estudiante' 
      );
      Swal.fire({
        title: 'Por favor espera!',
        html: '<b></b>',
        allowEnterKey: false,
        allowEscapeKey:false,
        allowOutsideClick:false,
        showCancelButton: false,
        showConfirmButton:false,
        showCloseButton:false,
        timer: 60000,
        timerProgressBar:false,
        onOpen:()=>{
          Swal.showLoading();
          const content = Swal.getHtmlContainer();
          const b = content.querySelector('b');
          b.textContent = "Rechazando propuesta";
          this._pasantiaService.putSolicitudJefe(this.pasantiaSelected._id, pasantia).subscribe(async(resp:any)=>{
            b.textContent = "Enviando notificación al estudiante";
            await this._notificacionService.postNotificacion(notificacionE).toPromise();
            await this._notificacionService.sendNotificacionCorreo(notificacionE).toPromise();
            Swal.fire({
              html: `Propuesta rechazada correctamente`,
              icon: 'success',
              allowEnterKey: false,
              allowEscapeKey:false,
              allowOutsideClick:false,
              showCancelButton: false,
              showConfirmButton:false,
              showCloseButton:false,
              timer: 1000,
              timerProgressBar:false
            }).then(() => {
              const btnCloseRechazar = (document.getElementById('btnCloseRechazar')) as HTMLButtonElement;
              btnCloseRechazar.click();
              this.getPasantias();
            });
          });
        }
      });
    }
  }

  getPasantias() {
    this._pasantiaService.getSolicitudes(this.user.programa).subscribe((resp: any) => {
      this.pasantias = resp.pasantias;
    });
  }

  getDataInfo(data: any) {
    this.notasPasantia = "";
    this.tutorSelected = "";
    this.pasantiaSelected = data;
  }

  getTutorSelected(){
    var selectTutor = (document.getElementById("tutorSelected")) as HTMLSelectElement;
    var selectedIndex = selectTutor.selectedIndex;
    console.log(selectedIndex)
    if(selectedIndex > 0){
      selectedIndex = selectedIndex-1;
      this.tutorSelected = this.directores[selectedIndex];
    }else{
      this.tutorSelected = "";
    }
  }

}
