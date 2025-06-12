import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean | UrlTree> {
    const user = await this.authService.getUsuarioActual(); // método que devuelve el user
    if (!user) {
      return this.router.createUrlTree(['/login']);
    }

    const rol = await this.authService.obtenerRolDeUsuario(user.id);

    if (rol === 'admin') {
      return true;
    } else {
      return this.router.createUrlTree(['/no-autorizado']); // opcional
    }
  }
}
