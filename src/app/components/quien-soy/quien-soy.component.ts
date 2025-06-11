import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { supabase } from '../../services/supabase.service';

@Component({
  selector: 'app-quien-soy',
  imports: [NgFor, RouterLink, NgIf],
  templateUrl: './quien-soy.component.html',
  styleUrl: './quien-soy.component.scss',
})
export class QuienSoyComponent implements OnInit {
  nombre: string = 'Cristian Corsaro';
  descripcion: string =
    'Soy estudiante de la tecnicatura universitaria en programación de la UTN de Avellaneda cursando las últimas 2 materias para recibirme.';
  intereses: string[] = ['Desarrollo Web', 'Angular', 'TypeScript', 'Node.js'];
  imagenUrl: string = '';
  descripcionJuegoUno: string =
    'La batalla naval cuenta con 5 barcos de 2 casilleros cada uno que aleatoriamente el sistema pone en el tablero de 10x10.';
  descripcionJuegoDos: string =
    'Con cierta cantidad de intentos que serán el puntaje final al ganar el juego una vez que encontremos a los 5 barcos';
  async ngOnInit() {
    const { data } = supabase.storage.from('imagenes').getPublicUrl('CV.png');
    this.imagenUrl = data.publicUrl;
  }
}
