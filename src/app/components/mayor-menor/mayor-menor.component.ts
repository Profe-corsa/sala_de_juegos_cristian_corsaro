import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Route, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface Card {
  code: string;
  image: string;
  value: string;
  suit: string;
}

@Component({
  selector: 'app-mayor-menor',
  templateUrl: './mayor-menor.component.html',
  styleUrl: './mayor-menor.component.scss',
  standalone: false,
})
export class MayorMenorComponent {
  deckId: string = '';
  currentCard: Card | null = null;
  nextCard: Card | null = null;
  score: number = 0;
  attempts: number = 3; // 🆕 NUEVO
  gameOver: boolean = false;
  loading: boolean = false;

  constructor(private http: HttpClient, private router: Router, private auth: AuthService) {
    this.startGame();
  }

  startGame() {
    this.loading = true;
    this.attempts = 3; // Reiniciar intentos
    this.score = 0;
    this.gameOver = false;

    this.http
      .get<any>('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .subscribe((data) => {
        this.deckId = data.deck_id;
        this.drawCard();
      });
  }

  drawCard() {
    this.http
      .get<any>(
        `https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=2`
      )
      .subscribe((data) => {
        if (data.cards.length < 2) {
          this.gameOver = true;
          this.auth.guardarResultado('Mayor o Menor', this.score);
          return;
        }

        this.currentCard = data.cards[0];
        this.nextCard = data.cards[1];
        this.loading = false;
      });
  }

  makeGuess(isHigher: boolean) {
    if (this.gameOver || !this.currentCard || !this.nextCard) return;

    const currentValue = this.getCardValue(this.currentCard.value);
    const nextValue = this.getCardValue(this.nextCard.value);

    const correct = isHigher
      ? nextValue > currentValue
      : nextValue < currentValue;

    if (correct) {
      this.score++;
      this.currentCard = this.nextCard;
      this.getNextCard();
    } else {
      this.attempts--;
      if (this.attempts <= 0) {
        this.gameOver = true;
        this.auth.guardarResultado('Mayor o Menor', this.score);
      } else {
        this.currentCard = this.nextCard;
        this.getNextCard();
      }
    }
  }

  getNextCard() {
    this.http
      .get<any>(
        `https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=1`
      )
      .subscribe((data) => {
        if (data.cards.length === 0) {
          this.gameOver = true;
          this.auth.guardarResultado('Mayor o Menor', this.score);
        } else {
          this.nextCard = data.cards[0];
        }
      });
  }

  getCardValue(value: string): number {
    switch (value) {
      case 'ACE':
        return 14;
      case 'KING':
        return 13;
      case 'QUEEN':
        return 12;
      case 'JACK':
        return 11;
      default:
        return parseInt(value, 10);
    }
  }

  volverABienvenido() {
    this.router.navigate(['/bienvenido']);
  }
}
