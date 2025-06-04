import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mostrar-palabra',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mostrar-palabra.component.html',
  styleUrl: './mostrar-palabra.component.scss',
})
export class MostrarPalabraComponent {
  @Input() secretWord!: string;
  @Input() guessedLetters!: string[];
}
