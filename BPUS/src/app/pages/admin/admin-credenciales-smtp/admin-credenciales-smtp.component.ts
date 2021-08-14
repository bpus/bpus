import { Component, OnInit } from '@angular/core';
import { CredencialesSMTPService } from 'src/app/services/service.index'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-credenciales-smtp',
  templateUrl: './admin-credenciales-smtp.component.html',
  styles: [
  ]
})
export class AdminCredencialesSMTPComponent implements OnInit {

  info = JSON.parse(localStorage.getItem('user'));

  user:string = "";
  pass:string = "";
  id:string = "";
  new_user:string = "";
  new_pass:string ="";

  isValid = false;
  isDiff = false;

  constructor(private _credencialesService: CredencialesSMTPService) { }

  ngOnInit(): void {
    this.getCredenciales();
  }

  getCredenciales(){
    this._credencialesService.getCredenciales().subscribe((resp:any)=>{
      this.user = resp.credencialesSMTP.user
      this.pass = resp.credencialesSMTP.pass;
      this.id = resp.credencialesSMTP._id;
      this.new_user = resp.credencialesSMTP.user
      this.new_pass = resp.credencialesSMTP.pass;
    });
  }

  check(){
    if(this.new_user !== "" && this.new_pass !== ""){
      this.isValid = true;
    }else{
      this.isValid = false;
    }
    if(this.new_user !== this.user || this.new_pass !== this.pass){
      this.isDiff = true;
    }else{
      this.isDiff = false;
    }
  }

  showpassword(){
    let pass = document.getElementById('password') as HTMLInputElement;
    const icon = document.getElementById('showpass');
    if (pass.getAttribute('type') === 'password') {
      pass.setAttribute('type', 'text');
      icon.setAttribute('class', 'fa fa-eye-slash');
    } else {
      pass.setAttribute('type', 'password');
      icon.setAttribute('class', 'fa fa-eye');
    }
  }

  reset(){
    this.new_user = this.user;
    this.new_pass = this.pass;
    this.isValid = false;
    this.isDiff = false;
  }

  async edit(){
    let check = await Swal.fire({
      title:"Editar credenciales??!",
      html: "<b>Esta operacion no se puede deshacer!!</b><br>"+
            "<label class='mt-2'>Escribe tu identificación:<label>",
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
        }else if(value !== this.info.identificacion){
          return 'No coincide tu identificación'
        }
      }
    });
    if (check.value == this.info.identificacion) {
      const credenciales = {_id: this.id, user:this.new_user, pass: this.new_pass};
      this._credencialesService.putCredenciales(credenciales).subscribe((resp:any)=>{
        if(resp){
          Swal.fire({
            title: "Editado correctamente",
            icon: "success",
            showCancelButton: false,
            showConfirmButton:false,
            showCloseButton:false,
            allowEnterKey: false,
            allowEscapeKey:false,
            allowOutsideClick: false,
            timer:1500,
            timerProgressBar: false,
          }).then(() => {
            this.getCredenciales();
            this.reset();
          });
        }
      });  
    }
  }

}
