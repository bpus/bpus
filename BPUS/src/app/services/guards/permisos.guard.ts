import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import { PermisosService } from 'src/app/services/permisos/permisos.service';

@Injectable({
  providedIn: 'root'
})
export class PermisosGuard implements CanActivate {
  constructor (private _permisoService:PermisosService, private router:Router) {}

    async canActivate (route: ActivatedRouteSnapshot) {
    const pagina = route.url[0].path;
    try{
      const resp:any = await this._permisoService.getPermisosPagina(pagina).toPromise();
      if(resp.permiso == true){
        return true;
      }else{
        this.router.navigate(["/panel-principal"]);
      }
    }catch(err){
      console.log("Error al cargar el permiso");
    }
  }

}
