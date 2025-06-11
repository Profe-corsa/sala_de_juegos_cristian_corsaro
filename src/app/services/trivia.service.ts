import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Country {
  name: string;
  flag: string;
}

export interface FlagQuestion {
  flag: string;
  correctAnswer: string;
  options: string[];
}

@Injectable({
  providedIn: 'root',
})
export class TriviaService {

  constructor(private http: HttpClient) {}

  getFlagQuestions(amount: number = 5): Observable<FlagQuestion[]> {
    const url =
      'https://restcountries.com/v3.1/all?fields=name,flags,translations';

    return this.http.get<any[]>(url).pipe(
      map((countries) => {
        // Filtramos solo los países que tienen traducción al español
        const filtered = countries.filter((c) => c.translations?.spa?.common);

        const formattedCountries: Country[] = filtered.map((c) => ({
          name: c.translations.spa.common,
          flag: c.flags?.svg || c.flags?.png,
        }));

        const questions: FlagQuestion[] = [];

        for (let i = 0; i < amount; i++) {
          const correct = this.getRandomItem(formattedCountries);
          const incorrects = this.getRandomItems(
            formattedCountries.filter((c) => c.name !== correct.name),
            3
          );

          const options = this.shuffle([
            correct.name,
            ...incorrects.map((c) => c.name),
          ]);

          questions.push({
            flag: correct.flag,
            correctAnswer: correct.name,
            options,
          });
        }

        return questions;
      }),
      catchError((error) => {
        console.error('Error al obtener países:', error);
        return of([]);
      })
    );
  }

  private getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private getRandomItems<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  private shuffle<T>(array: T[]): T[] {
    return [...array].sort(() => 0.5 - Math.random());
  }
}
