import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { JuegosComponent } from './../components/juegos/juegos.component';
import { AhorcadoComponent } from './../components/ahorcado/ahorcado.component';
import { MayorMenorComponent } from './../components/mayor-menor/mayor-menor.component';
import { PreguntadosComponent } from '../components/preguntados/preguntados.component';
import { BatallaNavalComponent } from '../components/batalla-naval/batalla-naval.component';

const routes: Routes = [
  { path: '', component: JuegosComponent },
  { path: 'ahorcado', component: AhorcadoComponent },
  { path: 'mayor-menor', component: MayorMenorComponent },
  { path: 'preguntados', component: PreguntadosComponent },
  { path: 'batalla-naval', component: BatallaNavalComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JuegosRoutingModule {}
