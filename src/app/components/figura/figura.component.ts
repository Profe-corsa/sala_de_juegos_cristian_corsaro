import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-figura',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './figura.component.html',
  styleUrl: './figura.component.scss',
})
export class FiguraComponent {
  @Input() incorrectGuesses: number = 0;
}
