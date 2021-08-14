import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';


import {
  SharedService,
  LoginService,
  LoginGuardGuard,
  ProgramaService,
  ModalidadService,
  EmpresaService,
  VacantesService,
  PasantiService,
  ConvenioService,
  NotificacionesService,
  EstudianteService,
  PermisosGuard,
  NoModalidadGuard,
  ModalidadGuard,
  InformeSieteGuard,
  InformeCatorceGuard,
  InformeFinalGuard,
  VerificaTokenGuard,
  ActaInicioGuard,
  PropuestaPasantiaGuard,
  RolesService,
  AdministrativoService,
  ProyectoService,
  NoLoginGuardGuard,
  LineaInvestigacionService,
  BusquedaService,
  CredencialesSMTPService
} from './service.index'


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ], providers: [
    LoginService,
    SharedService,
    LoginGuardGuard,
    ProgramaService,
    ModalidadService,
    EmpresaService,
    VacantesService,
    PasantiService,
    ConvenioService,
    NotificacionesService,
    EstudianteService,
    PermisosGuard,
    ActaInicioGuard,
    ModalidadGuard,
    NoModalidadGuard,
    InformeSieteGuard,
    InformeCatorceGuard,
    InformeFinalGuard,
    VerificaTokenGuard,
    PropuestaPasantiaGuard,
    RolesService,
    AdministrativoService,
    ProyectoService,
    NoLoginGuardGuard,
    LineaInvestigacionService,
    BusquedaService,
    CredencialesSMTPService
  ]
})
export class ServiceModule { }
