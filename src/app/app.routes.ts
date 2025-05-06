import { Routes } from '@angular/router';

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
    path: '**',
    loadComponent: () =>
      import('./components/error/error.component').then(
        (m) => m.ErrorComponent
        
      ),
  },
];
