import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JuegosRoutingModule } from './../juegos-routing/juegos-routing.module';
import { JuegosComponent } from './../components/juegos/juegos.component';
import { AhorcadoComponent } from './../components/ahorcado/ahorcado.component';
import { MayorMenorComponent } from './../components/mayor-menor/mayor-menor.component';
import { FormsModule } from '@angular/forms';
import { FiguraComponent } from '../components/figura/figura.component';
import { MostrarPalabraComponent } from '../components/mostrar-palabra/mostrar-palabra.component';
import { TecladoComponent } from '../components/teclado/teclado.component';
import { EstadoJuegoComponent } from '../components/estado-juego/estado-juego.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [JuegosComponent, AhorcadoComponent, MayorMenorComponent],
  imports: [
    CommonModule,
    FormsModule,
    JuegosRoutingModule,
    FiguraComponent,
    MostrarPalabraComponent,
    TecladoComponent,
    EstadoJuegoComponent,
    HttpClientModule
  ],
  exports: [JuegosComponent],
})
export class JuegosModule {}
