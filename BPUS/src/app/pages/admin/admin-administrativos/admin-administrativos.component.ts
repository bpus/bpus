import { Component, OnInit } from '@angular/core';
import { 
  AdministrativoService,
  BusquedaService,
  NotificacionesService, 
  RolesService,
  ProgramaService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-admin-administrativos',
  templateUrl: './admin-administrativos.component.html'
})
export class AdminAdministrativosComponent implements OnInit {

  user = JSON.parse(localStorage.getItem('user'));
  admins:any;

  roles:any;
  programas:any;

  personRolAdd:string = "PROFESOR";
  programaAddValid = false;
  
  adminSelected:any;
  personRolEdit:String;
  editValid = false;
  editDiferente = false;

  desde: number = 0;
  campo:string = "nombres"
  pagina:number = 1;
  totalpaginas:number = 0

  constructor(
    private _notiService: NotificacionesService,
    private _busquedaService: BusquedaService, 
    private _adminService:AdministrativoService,
    private _rolService:RolesService,
    private _programaService: ProgramaService
    ) { }

  ngOnInit(): void {
    this.getAdmins();
    this.getRoles();
    this.getProgramas();
  }

  getAdmins(){
    this._adminService.getAdmins(this.desde, this.campo).subscribe((resp:any)=>{
      this.admins = resp;
      this.totalpaginas = Math.ceil(this._adminService.totalAdmins/10);
    })
  }

  getRoles(){
    this._rolService.getRoles().subscribe((resp:any) => {
      this.roles = resp.roles;
      for(let i in this.roles){
        if(this.roles[i].nombre == "ESTUDIANTE"){
          this.roles.splice(i, 1);
        }
      }
    });
  }

  getProgramas(){
    this._programaService.getTodosProgramas().subscribe((resp:any)=>{
      this.programas = resp;
    })
  }

  getPersonRolAdd(){
    const personRolAdd = (document.getElementById("personRol")) as HTMLSelectElement;
    const selectedIndex = personRolAdd.selectedIndex;
    this.personRolAdd = this.roles[selectedIndex+1].nombre;
  }

  async getAdminSelected(admin:any){
    this.adminSelected = admin;
    if(this.adminSelected.rol.nombre === "PROFESOR" && !this.adminSelected.programa){
      this.adminSelected.programa = "";
    }
    this.editDiferente = false;
    //Nombres
    const nombreEdit = (document.getElementById("nombreEdit")) as HTMLInputElement;
    nombreEdit.value = admin.nombres;
    nombreEdit.placeholder = admin.nombres;
    //Apellidos
    const apellidosEdit = (document.getElementById("apellidosEdit")) as HTMLInputElement;
    apellidosEdit.value = admin.apellidos;
    apellidosEdit.placeholder = admin.apellidos;
    //Identificación
    const identificacionEdit = (document.getElementById("identificacionEdit")) as HTMLInputElement;
    identificacionEdit.value = admin.identificacion;
    identificacionEdit.placeholder = admin.identificacion;
    //Rol
    const personRolEdit = (document.getElementById("personRolEdit")) as HTMLSelectElement;
    personRolEdit.value = admin.rol._id;
    this.personRolEdit = admin.rol.nombre;
    //Correo
    const correoEdit = (document.getElementById("correoEdit")) as HTMLInputElement;
    correoEdit.value = admin.correo;
    correoEdit.placeholder = admin.correo;
    //Teléfono
    const telefonoEdit = (document.getElementById("telefonoEdit")) as HTMLInputElement;
    telefonoEdit.value = admin.telefono;
    telefonoEdit.placeholder = admin.telefono;
    setTimeout(() => {
      if(admin.programa){
        const personProgramaEdit = (document.getElementById("personProgramaEdit")) as HTMLInputElement;
        personProgramaEdit.value = admin.programa._id;
      }else if(admin.cargo){
        const cargoEdit = (document.getElementById("cargoEdit")) as HTMLInputElement;
        cargoEdit.value = admin.cargo;
      }
      const openModalEdit = (document.getElementById("openModalEdit")) as HTMLButtonElement;
      openModalEdit.click();
    }, 100);
  }

  checkAdd(){
    const identificacion = (document.getElementById("identificacion")) as HTMLInputElement;
    const telefono = (document.getElementById("telefono")) as HTMLInputElement;
    identificacion.value = identificacion.value.replace(/\D/g, "");
    telefono.value = telefono.value.replace(/\D/g, "");
  }

  checkEdit(){
    const nombreEdit = (document.getElementById("nombreEdit")) as HTMLInputElement;
    const apellidosEdit = (document.getElementById("apellidosEdit")) as HTMLInputElement;
    const identificacionEdit = (document.getElementById("identificacionEdit")) as HTMLInputElement;
    const personRolEdit = (document.getElementById("personRolEdit")) as HTMLSelectElement;
    const correoEdit = (document.getElementById("correoEdit")) as HTMLInputElement;
    const telefonoEdit = (document.getElementById("telefonoEdit")) as HTMLInputElement;
    identificacionEdit.value = identificacionEdit.value.replace(/\D/g, "");
    telefonoEdit.value = telefonoEdit.value.replace(/\D/g, "");
    //check si es valido
    if(
      nombreEdit.value !== "" &&
      apellidosEdit.value !== "" &&
      identificacionEdit.value !== "" && identificacionEdit.value.length > 7 && parseInt(identificacionEdit.value) !== NaN &&
      personRolEdit.value !== "" &&
      correoEdit.value !== "" &&
      telefonoEdit.value !== "" && telefonoEdit.value.length >= 10 && parseInt(telefonoEdit.value) !== NaN
    ){
      this.editValid = true;
    }else{
      this.editValid = false;
    }
    if(this.personRolEdit === "PROFESOR"){
      const personProgramaEdit = (document.getElementById("personProgramaEdit")) as HTMLSelectElement;
      if(personProgramaEdit && personProgramaEdit.value !== ""){
        this.editValid = true;
      }else{
        this.editValid = false;
      }
    }else if(this.personRolEdit == "ENCARGADO_EMPRESA"){
      const cargoEdit = (document.getElementById("cargoEdit")) as HTMLInputElement;
      if(cargoEdit && cargoEdit.value !== ""){
        this.editValid = true;
      }else{
        this.editValid = false;
      }
    }
    //check si son diferentes
    if(this.adminSelected.rol.nombre !== this.personRolEdit){
      this.editDiferente = true;
    }else{
      if(this.personRolEdit === "PROFESOR"){
        const personProgramaEdit = (document.getElementById("personProgramaEdit")) as HTMLSelectElement;
        if(
          nombreEdit.value !== this.adminSelected.nombres ||
          apellidosEdit.value !== this.adminSelected.apellidos ||
          identificacionEdit.value !== this.adminSelected.identificacion ||
          correoEdit.value !== this.adminSelected.correo ||
          telefonoEdit.value !== this.adminSelected.telefono ||
          personProgramaEdit.value !== this.adminSelected.programa._id
        ){
          this.editDiferente = true;
        }else{
          this.editDiferente = false;
        }
      }else if(this.personRolEdit == "ENCARGADO_EMPRESA"){
        const cargoEdit = (document.getElementById("cargoEdit")) as HTMLInputElement;
        if(
          nombreEdit.value !== this.adminSelected.nombres ||
          apellidosEdit.value !== this.adminSelected.apellidos ||
          identificacionEdit.value !== this.adminSelected.identificacion ||
          correoEdit.value !== this.adminSelected.correo ||
          telefonoEdit.value !== this.adminSelected.telefono ||
          cargoEdit.value !== this.adminSelected.cargo
        ){
          this.editDiferente = true;
        }else{
          this.editDiferente = false;
        }
      }else{
        if(
          nombreEdit.value !== this.adminSelected.nombres ||
          apellidosEdit.value !== this.adminSelected.apellidos ||
          identificacionEdit.value !== this.adminSelected.identificacion ||
          correoEdit.value !== this.adminSelected.correo ||
          telefonoEdit.value !== this.adminSelected.telefono
        ){
          this.editDiferente = true;
        }else{
          this.editDiferente = false;
        }
      }
    }
  }

  getPersonRolEdit(){
    const personRolEdit = (document.getElementById("personRolEdit")) as HTMLSelectElement;
    const selectedIndex = personRolEdit.selectedIndex;
    this.personRolEdit = this.roles[selectedIndex+1].nombre;
  }

  cambiarDesde(valor:number){

    let desde = this.desde + valor;
  
    if (desde >= this._adminService.totalAdmins) {
      return;
    }
    if (desde <0 ) {
      return;
    }
    this.desde += valor;
    this.pagina = (this.desde/10)+1;
    this.getAdmins();
  }

  cambiarDesdeInput(valor:number){
    this.desde = (valor-1)*10;
    if(valor > this.totalpaginas){
      const inputPagina = (document.getElementById('pagina')) as HTMLInputElement;
      inputPagina.value = this.pagina.toString();
      return;
    }
    if (this.desde >= this._adminService.totalAdmins) {
      return;
    }
    if (this.desde <0 ) {
      return;
    }
    this.pagina = (this.desde/10)+1;
    this.getAdmins();
  }

  getDataBuscar(data: string){
    if(data){
      this._busquedaService.buscar('administrativo', data).subscribe((resp:any) => {
        this.admins = resp.administrativo;
      });
    }else{
      this.getAdmins();
    }
  }

  postAdmin(f:NgForm){
    Swal.fire({
      title:"Crear "+this.personRolAdd+"?",
      icon: "question",
      showCancelButton: true,
      showConfirmButton:true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33',
      showCloseButton:false,
    }).then((result) => {
      if(result.value){
        let nombres = f.value.nombre.toUpperCase();
        let apellidos = f.value.apellidos.toUpperCase();
        let admin:any = {
          identificacion: f.value.identificacion,
          nombres: nombres,
          apellidos: apellidos,
          correo: f.value.correo,
          telefono: f.value.telefono,
          rol: f.value.rol
        }
        if(f.value.programa){
          admin.programa = f.value.programa;
        }else if(f.value.cargo){
          admin.cargo = f.value.cargo;
        }
        this._adminService.postAdmin(admin).subscribe((resp:any)=>{
          if(resp){
            this._notiService.sendUSuarioNuevo(admin).subscribe();
            Swal.close();
            Swal.fire({
              title: this.personRolAdd+" creado correctamente",
              icon: "success",
              showCancelButton: false,
              showConfirmButton:false,
              showCloseButton:false,
              allowEnterKey: false,
              allowEscapeKey:false,
              allowOutsideClick: false,
              timer:1000,
              timerProgressBar: true,
            }).then((result) => {
              const btnCancelarAdd = (document.getElementById("btnCancelarAdd")) as HTMLButtonElement;
              if(result.value){
                btnCancelarAdd.click()
                this.getAdmins();
              }else{
                btnCancelarAdd.click();
                this.getAdmins();
              }
            });
          }
        });
      }
    });
  }

  putAdmin(){
    const nombreEdit = (document.getElementById("nombreEdit")) as HTMLInputElement;
    const apellidosEdit = (document.getElementById("apellidosEdit")) as HTMLInputElement;
    const identificacionEdit = (document.getElementById("identificacionEdit")) as HTMLInputElement;
    const personRolEdit = (document.getElementById("personRolEdit")) as HTMLSelectElement;
    const correoEdit = (document.getElementById("correoEdit")) as HTMLInputElement;
    const telefonoEdit = (document.getElementById("telefonoEdit")) as HTMLInputElement;
    Swal.fire({
      title:"Cambiar datos de "+this.adminSelected.nombres+" ?",
      icon: "question",
      showCancelButton: true,
      showConfirmButton:true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33',
      showCloseButton:false,
    }).then((result) => {
      if(result.value){
        let nombres = nombreEdit.value.toUpperCase();
        let apellidos = apellidosEdit.value.toUpperCase();
        let admin:any = {
          _id: this.adminSelected._id,
          identificacion: identificacionEdit.value,
          nombres: nombres,
          apellidos: apellidos,
          correo: correoEdit.value,
          telefono: telefonoEdit.value,
          rol: personRolEdit.value
        }
        if(this.personRolEdit == "PROFESOR" || this.personRolEdit == "  JEFE_PROGRAMA"){
          const personProgramaEdit = (document.getElementById("personProgramaEdit")) as HTMLSelectElement;
          admin.programa = personProgramaEdit.value;
        }else if(this.personRolEdit == "ENCARGADO_EMPRESA"){
          const cargoEdit = (document.getElementById("cargoEdit")) as HTMLInputElement;
          admin.cargo = cargoEdit.value;
        }
        this._adminService.putAdmin(admin).subscribe((resp:any)=>{
          if(resp){
            Swal.close();
            Swal.fire({
              title: "Editado correctamente",
              icon: "success",
              showCancelButton: false,
              showConfirmButton:false,
              showCloseButton:false,
              allowEnterKey: false,
              allowEscapeKey:false,
              allowOutsideClick: false,
              timer:1000,
              timerProgressBar: true,
            }).then((result) => {
              const btnCancelarEdit = (document.getElementById("btnCancelarEdit")) as HTMLButtonElement;
              if(result.value){
                btnCancelarEdit.click()
                this.getAdmins();
              }else{
                btnCancelarEdit.click();
                this.getAdmins();
              }
            });
          }
        });
      }
    });
  }

  cambiarEstado(id:string, estado:boolean){
    let txt = "";
    if(estado){
      txt = "Activar"
    }else{
      txt = "Desactivar"
    }
    Swal.fire({
      title: txt+" Usuario?",
      icon: "warning",
      showCancelButton: true,
      showConfirmButton:true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33',
      showCloseButton:false,
    }).then((result) => {
      if(result.value){
        const admin = {_id: id, estado: estado};
        this._adminService.cambiarEstado(admin).subscribe((resp:any)=>{
          if(resp){
            Swal.close();
            Swal.fire({
              title: "Estado cambiado correctamente",
              icon: "success",
              showCancelButton: false,
              showConfirmButton:false,
              showCloseButton:false,
              allowEnterKey: false,
              allowEscapeKey:false,
              allowOutsideClick: false,
              timer:1000,
              timerProgressBar: true,
            }).then((result) => {
              if(result.value){
                this.getAdmins();
              }else{
                this.getAdmins();
              }
            });
          }
        });
      }
    });  
  }

  async deleteAdmin(admin:any){
    let check = await Swal.fire({
      title:"Eliminar a "+admin.nombres+" ?",
      html: "<b>Esta operacion no se puede deshacer!!</b><br>"+
            "<label class='mt-2'>Escribe la identificación:<label>",
      icon: "warning",
      showCancelButton: true,
      showConfirmButton:true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33',
      showCloseButton:false,
      input: "text",
      inputPlaceholder: 'Identificación',
      inputAttributes: {
        maxlength: "10",
        minlength: "8",
        onkeypress: "return (event.charCode >= 48 && event.charCode <= 57)",
        onCopy: "return false", 
        onDrag: "return false",
        onDrop: "return false",
        onPaste: "return false"
      },
      inputValidator: (value) => {
        if (!value) {
          return 'Tienes que escribir algo!'
        }else if(value !== admin.identificacion){
          return 'No coincide con la identificación'
        }
      }
    });
    if (check.value == admin.identificacion) {
      this._adminService.deleteAdmin(admin._id).subscribe((resp:any)=>{
        if(resp){
          Swal.fire({
            title: "Eliminado correctamente",
            icon: "success",
            showCancelButton: false,
            showConfirmButton:false,
            showCloseButton:false,
            allowEnterKey: false,
            allowEscapeKey:false,
            allowOutsideClick: false,
            timer:1000,
            timerProgressBar: true,
          }).then((result) => {
            if(result.value){
              this.getAdmins();
            }else{
              this.getAdmins();
            }
          });
        }
      });  
    }
  }

}
