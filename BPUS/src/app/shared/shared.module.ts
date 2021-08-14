import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';

// Pipes
import { PipesModule } from '../pipes/pipes.module';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NavbarInscripcionComponent } from './navbar-inscripcion/navbar-inscripcion.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';



@NgModule({
  imports: [
    PipesModule,
    CommonModule,
    BrowserModule,
    RouterModule
  ],
  declarations: [
    NavbarComponent,
    SidebarComponent,
    BreadcrumbsComponent,
    NavbarInscripcionComponent,
    NopagefoundComponent
  ],
  providers: [
    NavbarComponent,
    SidebarComponent,
    BreadcrumbsComponent,
    NavbarInscripcionComponent
  ],
  exports: [
    NavbarComponent,
    SidebarComponent,
    BreadcrumbsComponent,
    NavbarInscripcionComponent
  ]
})
export class SharedModule { }
