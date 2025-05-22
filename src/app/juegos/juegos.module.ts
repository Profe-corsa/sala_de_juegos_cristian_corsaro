import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JuegosRoutingModule } from './../juegos-routing/juegos-routing.module';
import { JuegosComponent } from './../components/juegos/juegos.component';
import { AhorcadoComponent } from './../components/ahorcado/ahorcado.component';
import { MayorMenorComponent } from './../components/mayor-menor/mayor-menor.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [JuegosComponent, AhorcadoComponent, MayorMenorComponent],
  imports: [CommonModule, FormsModule, JuegosRoutingModule],
  exports: [JuegosComponent],
})
export class JuegosModule {}
