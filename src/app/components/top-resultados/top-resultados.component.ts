import { Component, OnInit } from '@angular/core';
import { JuegosService } from '../../services/juegos.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-resultados',
  imports: [CommonModule],
  templateUrl: './top-resultados.component.html',
  styleUrl: './top-resultados.component.scss',
})
export class TopResultadosComponent implements OnInit {
  juegos = ['Ahorcado', 'Mayor o Menor', 'Preguntados', 'Batalla naval'];
  topPorJuego: { [juego: string]: any[] } = {};

  constructor(private juegosService: JuegosService, private router: Router) {}

  async ngOnInit() {
    for (const juego of this.juegos) {
      const resultados = await this.juegosService.obtenerTop5PorJuego(juego);
      this.topPorJuego[juego] = resultados;
    }
  }

  volverABienvenido() {
    this.router.navigate(['/bienvenido']);
  }
}
