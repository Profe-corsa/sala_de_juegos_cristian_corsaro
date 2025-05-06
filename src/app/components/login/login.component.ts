import { Component } from '@angular/core';
import { Usuario } from '../../classes/usuario';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { supabase } from '../../services/supabase.service';
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

  constructor(private router: Router) {
    this.usuario = new Usuario();
  }

  async login() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: this.usuario.correo,
      password: this.usuario.clave,
    });

    if (error) {
      this.error = error.message;
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: 'Usuario o contraseña incorrecta',
      })
    } else {
      this.router.navigate(['/bienvenido']); 
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
}
