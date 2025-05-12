import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../classes/usuario';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss',
})
export class RegistroComponent {
  protected usuario: Usuario;
  constructor(private auth: AuthService, private router: Router) {
    this.usuario = new Usuario();
    this.limpiar();
  }

  async register() {
    const error = await this.auth.registro(
      this.usuario.correo,
      this.usuario.clave
    );

    if (!error) {
      //this.error = error.message;
      Swal.fire({
        title: 'Error al intentar registrarse',
        icon: 'error',
        text: 'Faltan datos o ya estás registrado',
      });
    }


  }

  limpiar(): void {
    this.usuario.correo = '';
    this.usuario.clave = '';
    this.usuario.apellido = '';
    this.usuario.nombre = '';
  }

  saludar(): void {
    this.limpiar();
    this.router.navigate(['/bienvenido']);
  }
  iniciar(): void {
    this.limpiar();
    this.router.navigate(['/login']);
  }
}
