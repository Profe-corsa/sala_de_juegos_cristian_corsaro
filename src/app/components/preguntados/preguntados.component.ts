import { Component, OnInit } from '@angular/core';
import { TriviaService } from './../../services/trivia.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preguntados',
  templateUrl: './preguntados.component.html',
  styleUrl: './preguntados.component.scss',
  standalone: false,
})
export class PreguntadosComponent implements OnInit {
  preguntas: any[] = [];
  indicePreguntaActual: number = 0;
  preguntaActual: any;
  puntaje: number = 0;
  juegoTerminado: boolean = false;
  intentosRestantes: number = 3;

  constructor(
    private servicioTrivia: TriviaService,
    private servicioAuth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarPreguntas();
  }

  cargarPreguntas() {
    this.servicioTrivia.getFlagQuestions().subscribe((respuesta: any) => {
      this.preguntas = respuesta.map((p: any) => ({
        bandera: p.flag,
        respuestaCorrecta: p.correctAnswer,
        opciones: this.mezclarOpciones(p.options),
      }));
      this.preguntaActual = this.preguntas[this.indicePreguntaActual];
    });
  }

  mezclarOpciones(opciones: string[]): string[] {
    return opciones.sort(() => Math.random() - 0.5);
  }

  seleccionarRespuesta(seleccionada: string) {
    if (seleccionada === this.preguntaActual.respuestaCorrecta) {
      this.puntaje++;
    } else {
      this.intentosRestantes--;
    }

    if (this.intentosRestantes <= 0) {
      this.finalizarJuego();
    } else {
      this.siguientePregunta();
    }
  }

  siguientePregunta() {
    this.indicePreguntaActual++;
    if (this.indicePreguntaActual < this.preguntas.length) {
      this.preguntaActual = this.preguntas[this.indicePreguntaActual];
    } else {
      this.finalizarJuego();
    }
  }

  finalizarJuego() {
    this.juegoTerminado = true;
    this.servicioAuth.guardarResultado('Preguntados', this.puntaje);
  }

  reiniciarJuego() {
    this.indicePreguntaActual = 0;
    this.puntaje = 0;
    this.intentosRestantes = 3;
    this.juegoTerminado = false;
    this.cargarPreguntas();
  }

  volverABienvenido() {
    this.router.navigate(['/bienvenido']);
  }
}
