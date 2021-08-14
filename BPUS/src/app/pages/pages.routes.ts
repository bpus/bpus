import { Routes, RouterModule } from "@angular/router";

import { PagesComponent } from "./pages.component";
import { InscripcionPasantiaComponent } from "./solicitudes/pasantia/inscripcion-pasantia/inscripcion-pasantia.component";
import { VacantesComponent } from "./encargado/vacantes/vacantes.component";
import { EncarSolicitudVacanteComponent } from "./encargado/solicitud-vacante/solicitud-vacante.component";
import { MiSolicitudComponent } from "./estudiante/mi-solicitud/mi-solicitud.component";
import { PropuestaPasantiaComponent } from "./estudiante/pasantia/propuesta-pasantia/propuesta-pasantia.component";
import { InformeCatorceComponent } from "./estudiante/pasantia/informe-catorce/informe-catorce.component";
import { InformeFinalComponent } from "./estudiante/pasantia/informe-final/informe-final.component";
import { InformeSieteComponent } from "./estudiante/pasantia/informe-siete/informe-siete.component";
import { NotificacionesComponent} from "./notificaciones/notificaciones.component";
import { PerfilComponent } from "./perfil/perfil.component";
import { PasantiaComponent } from "./solicitudes/pasantia/pasantia-main/pasantia-main.component";
import { SemilleroComponent } from "./solicitudes/semillero/semillero/semillero.component";
import { SolicitudProyectoComponent } from "./solicitudes/proyecto/proyecto.component";
import { ModalidadesComponent } from "./modalidades/modalidades.component";
import { EmpresasComponent } from "./docente/empresas/empresas.component";
import { InscripcionDirectaComponent} from "./solicitudes/pasantia/inscripcion-directa/inscripcion-directa.component";
import { MainComponent } from "./main/main.component";
import { ActaInicioPasantiaComponent } from "./estudiante/pasantia/acta-inicio-pasantia/acta-inicio-pasantia.component";
import { AdminEstudiantesComponent } from "./admin/admin-estudiantes/admin-estudiantes.component";
import { GestionJuradosComponent } from "./docente/gestion-jurados/gestion-jurados.component";
import { JuradoComponent } from "./docente/jurado/jurado.component";
import { SustentacionComponent } from "./estudiante/sustentacion/sustentacion.component";
import { AnteproyectoComponent } from "./estudiante/proyecto/anteproyecto/anteproyecto.component";
import { ProyectoComponent } from "./estudiante/proyecto/proyecto/proyecto.component";
import { AceptarProyectoComponent } from "./estudiante/proyecto/aceptar-proyecto/aceptar-proyecto.component";
import { PropuestasComponent } from "./docente/propuestas/propuestas.component";
import { TutoriasComponent } from "./docente/tutorias/tutorias.component";
import { InscripcionProyectoComponent } from './estudiante/proyecto/inscripcion-proyecto/inscripcion-proyecto.component';
import { GestionModalidadesComponent } from './docente/gestion-modalidades/gestion-modalidades.component';
import { LineasJefeComponent } from './docente/lineas-jefe/lineas-jefe.component';
import { RePasantiaComponent } from './estudiante/pasantia/re-pasantia-main/re-pasantia-main.component';
import { ReInscripcionDirectaComponent } from './estudiante/pasantia/re-inscripcion-directa/re-inscripcion-directa.component';
import { ReInscripcionPasantiaComponent } from './estudiante/pasantia/re-inscripcion-pasantia/re-inscripcion-pasantia.component';
//admin
import { RolesComponent } from "./admin/roles/roles.component";
import { PermisosComponent } from "./admin/permisos/permisos.component";
import { AdminAdministrativosComponent } from "./admin/admin-administrativos/admin-administrativos.component";
import { AdminConveniosComponent } from "./admin/admin-convenios/admin-convenios.component";
import { AdminEmpresasComponent } from "./admin/admin-empresas/admin-empresas.component";
import { AdminModalidadComponent } from "./admin/admin-modalidad/admin-modalidad.component";
import { AdminProgramaComponent } from "./admin/admin-programa/admin-programa.component";
import { AdminLineasComponent } from './admin/admin-lineas/admin-lineas.component';
import { AdminCredencialesSMTPComponent } from './admin/admin-credenciales-smtp/admin-credenciales-smtp.component';
//Guards
import { ActaInicioGuard } from "../services/service.index";
import { LoginGuardGuard } from "../services/service.index";
import { PermisosGuard } from "../services/service.index";
import { ModalidadGuard } from "../services/service.index";
import { NoModalidadGuard } from "../services/service.index";
import { InformeSieteGuard } from "../services/service.index";
import { InformeCatorceGuard } from "../services/service.index";
import { InformeFinalGuard } from "../services/service.index";
import { VerificaTokenGuard } from "../services/service.index";
import { PropuestaPasantiaGuard } from "../services/service.index";

const pagesRoutes: Routes = [

    { path: "modalidades", component: ModalidadesComponent, data: { titulo: "Modalidades Disponibles" }, canActivate: [LoginGuardGuard,PermisosGuard, VerificaTokenGuard, NoModalidadGuard] },
    { path: "solicitud-pasantia-supervisada", component: PasantiaComponent, data: { titulo: "Solicitud Pasantía" }, canActivate: [LoginGuardGuard,PermisosGuard, VerificaTokenGuard, NoModalidadGuard] },
    { path: "solicitud-proyecto-de-grado", component: SolicitudProyectoComponent, data: { titulo: "Solicitud Proyecto" }, canActivate: [LoginGuardGuard,PermisosGuard, VerificaTokenGuard, NoModalidadGuard] },
    { path: "solicitud-semillero-de-investigacion", component: SemilleroComponent, data: { titulo: "Solicitud Semillero" }, canActivate: [LoginGuardGuard,PermisosGuard, VerificaTokenGuard, NoModalidadGuard] },
    { path: "preinscripcion-pasantia", component: InscripcionPasantiaComponent, data: { titulo: "Pre-Inscripción de Pasantía" },canActivate: [LoginGuardGuard,PermisosGuard, VerificaTokenGuard, NoModalidadGuard], },
    { path: "inscripcion-directa-propuesta", component: InscripcionDirectaComponent, data: { titulo: "Inscripción directa de la propuesta" },canActivate: [LoginGuardGuard,PermisosGuard, VerificaTokenGuard, NoModalidadGuard] },
    {path: "aceptar-proyecto", component:AceptarProyectoComponent, data: {titulo: "Aceptar proyecto"}, canActivate:[PermisosGuard]},
    {
        path: "",
        component: PagesComponent,
        canActivate: [LoginGuardGuard, VerificaTokenGuard, ModalidadGuard],
        children: [
            { path: "panel-principal", component: MainComponent, data: { titulo: "Panel Principal" }},
            { path: "notificaciones", component: NotificacionesComponent, data: { titulo: "Notificaciones" }, canActivate: [PermisosGuard] },
            { path: "perfil", component: PerfilComponent, data: { titulo: "Perfil de Usuario" }},
            { path: "empresas", component: EmpresasComponent, data: { titulo: "Gestión de Empresas" } ,canActivate: [PermisosGuard]},
            { path: "vacantes", component: VacantesComponent, data: { titulo: "Gestión de Vacantes" } ,canActivate: [PermisosGuard]},
            { path: "inscripcion-propuesta", component: PropuestaPasantiaComponent, data: { titulo: "Inscripción de la Propuesta" },canActivate: [PermisosGuard, PropuestaPasantiaGuard] },
            { path: "mi-modalidad", component: MiSolicitudComponent, data: { titulo: "Seguimiento a la Modalidad" } ,canActivate: [PermisosGuard]},
            { path: "tutorias-asignadas", component: TutoriasComponent, data: { titulo: "Tutorias Asignadas" } ,canActivate: [PermisosGuard]},
            { path: "propuestas", component: PropuestasComponent, data: { titulo: "Propuestas de modalidad de grado" } ,canActivate: [PermisosGuard]},
            { path: "informe-siete", component: InformeSieteComponent, data: { titulo: "Envío de Informe de la Semana 7" } ,canActivate: [PermisosGuard, InformeSieteGuard]},
            { path: "informe-catorce", component: InformeCatorceComponent, data: { titulo: "Envío de Informe de la Semana 14" } ,canActivate: [PermisosGuard, InformeCatorceGuard]},
            { path: "informe-final", component: InformeFinalComponent, data: { titulo: "Envío de Informe Final" } ,canActivate: [PermisosGuard, InformeFinalGuard]},
            { path: "solicitud-vacantes", component: EncarSolicitudVacanteComponent, data: { titulo: "Solicitudes de vacantes" } ,canActivate: [PermisosGuard]},
            { path: "acta-inicio", component: ActaInicioPasantiaComponent, data: { titulo: "Acta de inicio" } ,canActivate: [PermisosGuard, ActaInicioGuard]},
            { path: "gestion-estudiantes", component: AdminEstudiantesComponent, data: { titulo: "Gestión de estudiantes" } ,canActivate: [PermisosGuard]},
            { path: "gestion-lineas-investigacion", component: LineasJefeComponent, data: { titulo: "Gestión de líneas de investigación" } ,canActivate: [PermisosGuard]},
            { path: "gestion-modalidades", component: GestionModalidadesComponent, data: { titulo: "Informes de modalidades" } ,canActivate: [PermisosGuard]},
            { path: "asignacion-sustentacion", component: GestionJuradosComponent, data: { titulo: "Asignación de jurados y sustentación" } ,canActivate: [PermisosGuard]},
            { path: "propuesta-proyecto", component:InscripcionProyectoComponent, data: {titulo: "Propuesta del proyecto"}, canActivate:[PermisosGuard]},
            { path: "anteproyecto", component:AnteproyectoComponent, data: {titulo: "Anteproyecto"}, canActivate:[PermisosGuard]},
            { path: "proyecto", component:ProyectoComponent, data: {titulo: "Proyecto"}, canActivate:[PermisosGuard]},
            { path: "jurado", component: JuradoComponent, data: { titulo: "Jurado" } ,canActivate: [PermisosGuard]},
            { path: "sustentacion", component: SustentacionComponent, data: { titulo: "Sustentación de la modalidad de grado" } ,canActivate: [PermisosGuard]},
            { path: "roles", component: RolesComponent, data: { titulo: "Administración de roles" } ,canActivate: [PermisosGuard]},
            { path: "permisos", component: PermisosComponent, data: { titulo: "Administración de permisos"},canActivate: [PermisosGuard]},
            { path: "admin-administrativos", component: AdminAdministrativosComponent, data: { titulo: "Administración de administrativos"},canActivate: [PermisosGuard]},
            { path: "admin-convenios", component: AdminConveniosComponent, data: { titulo: "Administración de convenios"},canActivate: [PermisosGuard]},
            { path: "admin-empresas", component: AdminEmpresasComponent, data: { titulo: "Administración de empresas"},canActivate: [PermisosGuard]},
            { path: "admin-modalidades", component: AdminModalidadComponent, data: { titulo: "Administración de modalidades"},canActivate: [PermisosGuard]},
            { path: "admin-programas", component: AdminProgramaComponent, data: { titulo: "Administración de programas"},canActivate: [PermisosGuard]},
            { path: "admin-lineas-investigacion", component: AdminLineasComponent, data: { titulo: "Administración de líneas de investigación"},canActivate: [PermisosGuard]},
            { path: "credenciales-smtp", component: AdminCredencialesSMTPComponent, data: { titulo: "Credenciales SMTP (Sendinblue)"},canActivate: [PermisosGuard]},
            { path: "re-inscripcion", component: RePasantiaComponent, data: { titulo: "Re-inscripción de Pasantía" }, canActivate: [PermisosGuard] },
            { path: "re-inscripcion-vacante", component: ReInscripcionPasantiaComponent, data: { titulo: "Re-inscripción por vacante" },canActivate: [PermisosGuard] },
            { path: "re-inscripcion-directa", component: ReInscripcionDirectaComponent, data: { titulo: "Re-inscripción directa" },canActivate: [PermisosGuard] },
            { path: "", redirectTo: "/panel-principal", pathMatch: "full" }
        ]
    },

];

export const PAGES_ROUTES = RouterModule.forRoot(pagesRoutes, { useHash: false });