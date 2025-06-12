import { Routes } from '@angular/router';
import { AdminGuard } from './components/admin.guard';
import { EncuestasRespuestasComponent } from './components/encuestas-respuestas/encuestas-respuestas.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'bienvenido',
    loadComponent: () =>
      import('./components/bienvenido/bienvenido.component').then(
        (m) => m.BienvenidoComponent
      ),
  },
  {
    path: 'quien-soy',
    loadComponent: () =>
      import('./components/quien-soy/quien-soy.component').then(
        (m) => m.QuienSoyComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./components/registro/registro.component').then(
        (m) => m.RegistroComponent
      ),
  },
  {
    path: 'juegos',
    loadChildren: () => import('./juegos/juegos.module').then(m => m.JuegosModule)
  },
  {
    path: 'encuestas',
    loadComponent: () => import('./components/encuestas/encuestas.component')
    .then((m)=>m.EncuestasComponent),
  },
  {
    path: 'encuestas-respuestas',
    component: EncuestasRespuestasComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'top-resultados',
    loadComponent: () => import('./components/top-resultados/top-resultados.component')
    .then((m)=>m.TopResultadosComponent)
  },
  {
    path: '**',
    loadComponent: () =>
      import('./components/error/error.component').then(
        (m) => m.ErrorComponent
      ),
  },
];
