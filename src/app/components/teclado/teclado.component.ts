import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-teclado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teclado.component.html',
  styleUrl: './teclado.component.scss',
})
export class TecladoComponent {
  @Input() guessedLetters: string[] = [];
  @Output() letterSelected = new EventEmitter<string>();

  letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

  selectLetter(letter: string) {
    this.letterSelected.emit(letter);
  }
}
