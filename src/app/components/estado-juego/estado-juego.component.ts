import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-estado-juego',
  standalone: true,
  imports: [],
  templateUrl: './estado-juego.component.html',
  styleUrl: './estado-juego.component.scss',
})
export class EstadoJuegoComponent {
  @Input() isWon!: boolean;
  @Output() restart = new EventEmitter<void>();
}
