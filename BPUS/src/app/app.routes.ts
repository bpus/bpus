import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { CambioClaveComponent } from './login/cambio-clave/cambio-clave.component';
import { PagesComponent } from './pages/pages.component';
import { NopagefoundComponent } from './shared/nopagefound/nopagefound.component';
import { OlvidoClaveComponent } from './login/olvido-clave/olvido-clave.component';

import { LoginGuardGuard, VerificaTokenGuard, NoLoginGuardGuard } from './services/service.index';

// Rutas principales de la aplicación
const appRoutes: Routes = [

    {path: 'login', component: LoginComponent, data: {titulo: 'login'}, canActivate: [NoLoginGuardGuard]},
    {path: 'cambio-contraseña/:token', component: CambioClaveComponent, data: {titulo: 'Cambio de contraseña'}},
    {path: 'olvido-clave', component: OlvidoClaveComponent, data: {titulo: 'Olvidé mi contraseña'}, canActivate: [NoLoginGuardGuard]},
    {path: '', component: PagesComponent, canActivate: [VerificaTokenGuard, LoginGuardGuard]},
    { path: '**' , component: NopagefoundComponent}

];

export const APP_ROUTES = RouterModule.forRoot( appRoutes, { useHash:false } );