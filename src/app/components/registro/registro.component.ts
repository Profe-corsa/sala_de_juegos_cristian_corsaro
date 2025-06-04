import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Usuario } from '../../classes/usuario';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss',
})
export class RegistroComponent {
  protected usuario: Usuario;
  registroForm: FormGroup;
  constructor(
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    //this.limpiar();
    this.usuario = new Usuario();
    this.registroForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      clave: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  get correo() {
    return this.registroForm.get('correo')!;
  }

  get nombre() {
    return this.registroForm.get('nombre')!;
  }

  get apellido() {
    return this.registroForm.get('apellido')!;
  }

  get clave() {
    return this.registroForm.get('clave')!;
  }
  async register() {
    if (this.registroForm.invalid) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }

    const { correo, clave } = this.registroForm.value;

    const error = await this.auth.registro(correo, clave);

    if (!error) {
      Swal.fire({
        icon: 'error',
        title: 'Error de registro',
        text: 'No se pudo registrar el usuario',
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
