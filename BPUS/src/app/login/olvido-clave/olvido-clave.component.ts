import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService, RolesService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-olvido-clave',
  templateUrl: './olvido-clave.component.html',
  styleUrls: ['./olvido-clave.component.css']
})
export class OlvidoClaveComponent implements OnInit {

  usuario: string = "";
  perfil: string = "";
  correo: string = "";
  correoValid = false;
  roles:any;
  spanPerfilDefaultStyle:string = "position:absolute; top:0; left:0; transform:translateY(30px); font-size:0.825em; transition-duration:300ms; color: #839198";

  constructor(private _rolesService: RolesService, private _loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    this.getRoles()
    const spanPefil = document.getElementById("spanPerfil") as HTMLSpanElement;
    spanPefil.setAttribute("style", this.spanPerfilDefaultStyle);
  }

  onFocus(){
    const spanPefil = document.getElementById("spanPerfil") as HTMLSpanElement;
    spanPefil.setAttribute("style", "color:#4D626C; font-weight: bold; transform:translateY(0px);");
  }

  onBlur(){
    const spanPefil = document.getElementById("spanPerfil") as HTMLSpanElement;
    if(this.perfil !== ""){
      spanPefil.setAttribute("style", "color:#4D626C; font-weight: bold; transform:translateY(0px);");
    }else{
      spanPefil.setAttribute("style", this.spanPerfilDefaultStyle);
    }
  }

  changeStyle(){
    const spanPefil = document.getElementById("spanPerfil") as HTMLSpanElement;
    const select = document.getElementById("selectPerfil") as HTMLSelectElement;
    if(this.perfil !== ""){
      spanPefil.setAttribute("style", "color:#4D626C; font-weight: bold; transform:translateY(0px);");
    }else if(this.perfil === ""){
      spanPefil.setAttribute("style", this.spanPerfilDefaultStyle);
      select.blur()
    }
  }

  checkUser(userInput: HTMLInputElement){
    if(this.perfil === 'ESTUDIANTE'){
      userInput.maxLength = 12;
      if(userInput.value.length === 1){
        userInput.value = userInput.value.replace(/[^u]/g, "");
        this.usuario = userInput.value;
      }else if(userInput.value.length > 1){
        let numValue = userInput.value.slice(1)
        userInput.value = "u"+numValue.replace(/\D/g, "");
        this.usuario = userInput.value;
      }
    }else{
      userInput.maxLength = 10;
      userInput.value = userInput.value.replace(/\D/g, "");
      this.usuario = userInput.value;
    }
  }

  checkCorreo(){
    const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
    if(pattern.test(this.correo)){
      this.correoValid = true;
    }else{
      this.correoValid = false;
    }
  }

  async getRoles(){
    let resp:any = await this._rolesService.getRolesOnlyName().toPromise();
    this.roles = resp.roles; 
  }

  enviarCorreo(){
    Swal.fire({
      html: "<p>Se te enviara al correo un link para poder acceder y cambiar tu contraseña.</p>"+
            "<br><p><b>Este link solo tendra una validez de 1 hora.</b></p>"+
            "<br><p>Confirmas que los datos son correctos?</p>",
      icon:"question",
      showCloseButton:false,
      showCancelButton: true,
      showConfirmButton:true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: '#60D89C',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if(result.value){
        let coleccion = (this.perfil === 'ESTUDIANTE') ? 'Estudiante' : 'Administrativo';
        const usuario = {perfil: coleccion, usuario: this.usuario, correo: this.correo };
        this._loginService.olvidoClave(usuario).subscribe((resp:any) =>{
          if(resp){
            Swal.fire({
              title: "Correo enviado exitosamente!",
              icon: "success",
              timer: 1400,
              timerProgressBar: false,
              showCloseButton:false,
              showCancelButton: false,
              showConfirmButton:false,
              allowEnterKey: false,
              allowEscapeKey: false,
              allowOutsideClick: false
            }).then(() => {
              this.router.navigate(["/login"]);
            });
          }
        })
      }
    });
  }

}
