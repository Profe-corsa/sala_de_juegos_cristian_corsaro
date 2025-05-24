import { Component } from '@angular/core';
import { Usuario } from '../../classes/usuario';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { supabase } from '../../services/supabase.service';
import { AuthService } from '../../services/auth.service'
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public usuario: Usuario;
  error = '';

  constructor(private router: Router, private auth: AuthService) {
    this.usuario = new Usuario();
  }

  async login() {
    const mensajeError = await this.auth.login(this.usuario.correo, this.usuario.clave);
    if (mensajeError) {
      Swal.fire({
        icon: 'error',
        title: 'Error de inicio de sesión',
        text: mensajeError,
      });
    }
  }

  cargarUsuario(correo: string, clave: string): void {
    this.usuario.correo = correo;
    this.usuario.clave = clave;
    this.login();
  }

  limpiar(): void {
    this.usuario.correo = '';
    this.usuario.clave = '';
  }

  saludar() {
    this.limpiar();
    this.router.navigate(['/bienvenido']);
  }
  registrar() {
    this.limpiar();
    this.router.navigate(['/registro']);
  }
}
