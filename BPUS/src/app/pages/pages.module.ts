import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Componentes
import { MainComponent } from './main/main.component';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { PerfilComponent } from './perfil/perfil.component';
import { PasantiaComponent } from './solicitudes/pasantia/pasantia-main/pasantia-main.component';
import { SemilleroComponent } from './solicitudes/semillero/semillero/semillero.component';
import { SolicitudProyectoComponent } from './solicitudes/proyecto/proyecto.component';
import { ModalidadesComponent } from './modalidades/modalidades.component';


// Rutas de pages
import { PAGES_ROUTES } from './pages.routes';

// Pipes
import { PipesModule } from '../pipes/pipes.module';
import { BrowserModule } from '@angular/platform-browser';
import { EmpresasComponent } from './docente/empresas/empresas.component';
import { FormsModule } from '@angular/forms';
import { InscripcionPasantiaComponent } from './solicitudes/pasantia/inscripcion-pasantia/inscripcion-pasantia.component';
import { VacantesComponent } from './encargado/vacantes/vacantes.component';
import { EncarSolicitudVacanteComponent } from './encargado/solicitud-vacante/solicitud-vacante.component';
import { MiSolicitudComponent } from './estudiante/mi-solicitud/mi-solicitud.component';
import { PropuestaPasantiaComponent } from './estudiante/pasantia/propuesta-pasantia/propuesta-pasantia.component';
import { InformeCatorceComponent } from './estudiante/pasantia/informe-catorce/informe-catorce.component';
import { InformeFinalComponent } from './estudiante/pasantia/informe-final/informe-final.component';
import { InformeSieteComponent } from './estudiante/pasantia/informe-siete/informe-siete.component';
import { NotificacionesComponent} from './notificaciones/notificaciones.component';
import { InscripcionDirectaComponent} from './solicitudes/pasantia/inscripcion-directa/inscripcion-directa.component';
import { ActaInicioPasantiaComponent } from './estudiante/pasantia/acta-inicio-pasantia/acta-inicio-pasantia.component';
import { AdminEstudiantesComponent } from './admin/admin-estudiantes/admin-estudiantes.component';
import { GestionJuradosComponent } from './docente/gestion-jurados/gestion-jurados.component';
import { JuradoComponent } from './docente/jurado/jurado.component';
import { SustentacionComponent } from './estudiante/sustentacion/sustentacion.component';
import { RolesComponent } from './admin/roles/roles.component';
import { PermisosComponent } from './admin/permisos/permisos.component';
import { AdminAdministrativosComponent } from './admin/admin-administrativos/admin-administrativos.component';
import { AdminConveniosComponent } from './admin/admin-convenios/admin-convenios.component';
import { AdminEmpresasComponent } from './admin/admin-empresas/admin-empresas.component';
import { AdminModalidadComponent } from './admin/admin-modalidad/admin-modalidad.component';
import { AdminProgramaComponent } from './admin/admin-programa/admin-programa.component';
import { AnteproyectoComponent } from './estudiante/proyecto/anteproyecto/anteproyecto.component';
import { ProyectoComponent } from './estudiante/proyecto/proyecto/proyecto.component';
import { AceptarProyectoComponent } from './estudiante/proyecto/aceptar-proyecto/aceptar-proyecto.component';
import { PropuestasComponent } from './docente/propuestas/propuestas.component';
import { TutoriasComponent } from './docente/tutorias/tutorias.component';
import { InscripcionProyectoComponent } from './estudiante/proyecto/inscripcion-proyecto/inscripcion-proyecto.component';
import { GestionModalidadesComponent } from './docente/gestion-modalidades/gestion-modalidades.component';
import { LineasJefeComponent } from './docente/lineas-jefe/lineas-jefe.component';
import { AdminLineasComponent } from './admin/admin-lineas/admin-lineas.component';
import { AdminCredencialesSMTPComponent } from './admin/admin-credenciales-smtp/admin-credenciales-smtp.component';
import { RePasantiaComponent } from './estudiante/pasantia/re-pasantia-main/re-pasantia-main.component';
import { ReInscripcionDirectaComponent } from './estudiante/pasantia/re-inscripcion-directa/re-inscripcion-directa.component';
import { ReInscripcionPasantiaComponent } from './estudiante/pasantia/re-inscripcion-pasantia/re-inscripcion-pasantia.component';

@NgModule({
  declarations: [
    PagesComponent,
    MainComponent,
    PerfilComponent,
    PasantiaComponent,
    SolicitudProyectoComponent,
    SemilleroComponent,
    ModalidadesComponent,
    EmpresasComponent,
    InscripcionPasantiaComponent,
    VacantesComponent,
    MiSolicitudComponent,
    PropuestaPasantiaComponent,
    PropuestasComponent,
    InformeSieteComponent,
    InformeCatorceComponent,
    InformeFinalComponent,
    NotificacionesComponent,
    EncarSolicitudVacanteComponent,
    InscripcionDirectaComponent,
    ActaInicioPasantiaComponent,
    AdminEstudiantesComponent,
    GestionJuradosComponent,
    JuradoComponent,
    SustentacionComponent,
    RolesComponent,
    PermisosComponent,
    AdminAdministrativosComponent,
    AdminConveniosComponent,
    AdminEmpresasComponent,
    AdminModalidadComponent,
    AdminProgramaComponent,
    AnteproyectoComponent,
    ProyectoComponent,
    AceptarProyectoComponent,
    TutoriasComponent,
    InscripcionProyectoComponent,
    GestionModalidadesComponent,
    LineasJefeComponent,
    AdminLineasComponent,
    AdminCredencialesSMTPComponent,
    RePasantiaComponent,
    ReInscripcionDirectaComponent,
    ReInscripcionPasantiaComponent
  ],
  exports: [
    CommonModule,
    PagesComponent,
    MainComponent,
    PerfilComponent,
    PasantiaComponent,
    SolicitudProyectoComponent,
    SemilleroComponent,
    ModalidadesComponent,
    VacantesComponent,
    MiSolicitudComponent,
    PropuestaPasantiaComponent,
    InformeSieteComponent,
    InformeCatorceComponent,
    InformeFinalComponent,
    NotificacionesComponent,
    EncarSolicitudVacanteComponent,
    InscripcionDirectaComponent,
    ActaInicioPasantiaComponent,
    AdminEstudiantesComponent,
    GestionJuradosComponent,
    JuradoComponent,
    SustentacionComponent

  ],
  imports: [
    SharedModule,
    PAGES_ROUTES,
    PipesModule,
    BrowserModule,
    FormsModule
  ]
})
export class PagesModule { }
