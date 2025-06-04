import { Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { PalabraService } from '../../services/palabra.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-ahorcado',
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.scss',
  standalone: false,
})
export class AhorcadoComponent {
  secretWord: string = '';
  guessedLetters: string[] = [];
  incorrectGuesses: number = 0;
  maxGuesses: number = 6;
  gameEnded: boolean = false;
  resultadoMensaje: string = '';

  constructor(
    private palabraService: PalabraService,
    private router: Router,
    private auth: AuthService
  ) {}

  async ngOnInit() {
    await this.inicializarJuego();
  }

  async inicializarJuego() {
    try {
      this.secretWord = await this.palabraService.getRandomWord();
      this.guessedLetters = [];
      this.incorrectGuesses = 0;
      this.gameEnded = false;
      this.resultadoMensaje = '';
      console.log('Nueva palabra secreta:', this.secretWord);
    } catch (error) {
      console.error('Error al obtener la palabra secreta:', error);
    }
  }

  async onLetterSelected(letter: string) {
    if (this.guessedLetters.includes(letter) || this.gameEnded) return;

    this.guessedLetters.push(letter);
    if (!this.secretWord.includes(letter)) {
      this.incorrectGuesses++;
    }

    if (this.isGameWon()) {
      this.gameEnded = true;
      this.resultadoMensaje = '¡Ganaste!';
      await this.auth.guardarResultado('Ahorcado', this.calcularPuntaje());
    } else if (this.isGameOver()) {
      this.gameEnded = true;
      this.resultadoMensaje = `Perdiste. La palabra era "${this.secretWord}".`;
      await this.auth.guardarResultado('Ahorcado', 0);
    }
  }

  isGameWon(): boolean {
    return this.secretWord
      .split('')
      .every((letter) => this.guessedLetters.includes(letter));
  }

  isGameOver(): boolean {
    return this.incorrectGuesses >= this.maxGuesses;
  }

  calcularPuntaje(): number {
    return Math.max(0, 100 - this.incorrectGuesses * 10);
  }

  async restartGame() {
    await this.inicializarJuego();
  }

  volverABienvenido() {
    this.router.navigate(['/bienvenido']);
  }
}