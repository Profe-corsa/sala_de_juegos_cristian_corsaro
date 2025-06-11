import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-batalla-naval',
  templateUrl: './batalla-naval.component.html',
  styleUrl: './batalla-naval.component.scss',
  standalone: false,
})
export class BatallaNavalComponent {
  letras: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  tablero: string[][] = [];
  mensaje: string = '¡Comienza el juego!';
  colorMensaje: string = 'black';
  cantidadBarcos: number = 0; // Total de casilleros ocupados por barcos
  aciertos: number = 0; // Barcos tocados

  filas: number = 10;
  columnas: number = 10;
  barcosTocados: number = 0;
  totalBarcos: number = 5;
  intentosFallidos: number = 0;
  maximosIntentosFallidos: number = 50;

  constructor(private router: Router, private auth: AuthService) {
    this.inicializarTablero();
  }

  inicializarTablero(): void {
    // Crear un tablero vacío
    this.tablero = Array(this.filas)
      .fill(null)
      .map(() => Array(this.columnas).fill(''));

    this.colocarBarcos();
    this.aciertos = 0;
    this.intentosFallidos = 0;
    this.mensaje = '¡Encuentra los barcos!';
    this.colorMensaje = 'black';
  }

  colocarBarcos(): void {
    this.cantidadBarcos = 0;

    const barcosAColocar = 5; // Barcos de 2 celdas

    for (let i = 0; i < barcosAColocar; i++) {
      let colocado = false;

      while (!colocado) {
        const fila = Math.floor(Math.random() * this.filas);
        const columna = Math.floor(Math.random() * (this.columnas - 1)); // Evitar desbordes

        if (
          this.tablero[fila][columna] === '' &&
          this.tablero[fila][columna + 1] === ''
        ) {
          this.tablero[fila][columna] = 'B'; // Parte del barco
          this.tablero[fila][columna + 1] = 'B'; // Parte adyacente
          this.cantidadBarcos += 2;
          colocado = true;
        }
      }
    }
  }

  seleccionarCasilla(fila: number, columna: number) {
    if (
      this.tablero[fila][columna] === 'X' ||
      this.tablero[fila][columna] === 'O'
    ) {
      return; // Ya fue seleccionada
    }

    if (this.tablero[fila][columna] === 'B') {
      this.tablero[fila][columna] = 'X'; // Barco tocado
      this.barcosTocados++;
      this.mensaje = '¡Tocaste un barco!';
      this.colorMensaje = 'green';

      if (this.barcosTocados === this.cantidadBarcos) {
        this.mensaje = '¡Ganaste! Encontraste todos los barcos.';
        this.colorMensaje = 'blue';
        const puntaje = this.maximosIntentosFallidos - this.intentosFallidos;
        this.auth.guardarResultado('Batalla naval', puntaje);
      }
    } else {
      this.tablero[fila][columna] = 'O'; // Agua
      this.intentosFallidos++;
      this.mensaje = '¡Fallaste! Intenta otra vez.';
      this.colorMensaje = 'red';

      if (this.intentosFallidos === this.maximosIntentosFallidos) {
        this.mensaje = '¡Perdiste! Se acabaron los intentos.';
        this.colorMensaje = 'darkred';
        this.revelarBarcosRestantes(); // ✅ NUEVA FUNCIÓN
      }
    }
  }

  revelarBarcosRestantes() {
    for (let i = 0; i < this.tablero.length; i++) {
      for (let j = 0; j < this.tablero[i].length; j++) {
        if (this.tablero[i][j] === 'B') {
          this.tablero[i][j] = 'R'; // Revelado pero no tocado
        }
      }
    }
  }
  volverABienvenido() {
    this.router.navigate(['/bienvenido']);
  }
}
