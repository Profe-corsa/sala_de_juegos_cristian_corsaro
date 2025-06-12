import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { format } from 'date-fns';
import { Router } from '@angular/router';

@Component({
  selector: 'app-encuestas',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './encuestas.component.html',
  styleUrl: './encuestas.component.scss',
})
export class EncuestasComponent {
  encuestaForm!: FormGroup;
  opcionesPregunta2: Record<string, string> = {
    opcion1: 'Chat',
    opcion2: 'Juegos',
    opcion3: 'Top 5',
  };
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.encuestaForm = this.fb.group({
      nombreApellido: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(19), Validators.max(98)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{1,10}$/)]],
      pregunta1: ['', Validators.required],
      pregunta2: this.fb.group(
        {
          opcion1: [false],
          opcion2: [false],
          opcion3: [false],
        },
        { validators: this.minCheckboxSelected(1) }
      ),
      pregunta3: ['', Validators.required],
    });
  }

  minCheckboxSelected(min = 1) {
    return (formGroup: AbstractControl) => {
      const values = Object.values(formGroup.value || {});
      const totalSelected = values.filter((v) => v === true).length;
      return totalSelected >= min ? null : { required: true };
    };
  }

  async guardarEncuesta() {
    if (this.encuestaForm.invalid) {
      this.encuestaForm.markAllAsTouched();
      return;
    }

    const form = this.encuestaForm.value;
    const user = await this.authService.getUsuarioActual();

    if (!user) {
      alert('Debes estar logueado para enviar la encuesta.');
      return;
    }
    console.log('id', user.id);
    const encuestaData = {
      user_id: user.id,

      nombre_apellido: form.nombreApellido,
      edad: form.edad,
      telefono: form.telefono,
      pregunta_1: form.pregunta1,
      pregunta_2: Object.entries(form.pregunta2)
        .filter(([_, v]) => v)
        .map(([k, _]) => this.opcionesPregunta2[k]),
      pregunta_3: form.pregunta3,
      fecha_creacion: format(new Date(), 'dd/MM/yyyy HH:mm'),
    };

    try {
      await this.authService.guardarEncuesta(encuestaData);
      alert('¡Encuesta enviada con éxito!');
      this.encuestaForm.reset();
    } catch (error) {
      alert('Error al guardar la encuesta. Intenta nuevamente.');
    }
  }

  volverABienvenido() {
    this.router.navigate(['/bienvenido']);
  }
}