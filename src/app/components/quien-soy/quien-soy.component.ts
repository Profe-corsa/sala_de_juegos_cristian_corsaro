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

  async ngOnInit() {
    const { data } = supabase.storage.from('imagenes').getPublicUrl('CV.png');
    this.imagenUrl = data.publicUrl;
  }
}
