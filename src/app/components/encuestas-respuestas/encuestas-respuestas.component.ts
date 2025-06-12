import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'
import { CommonModule, NgIf } from '@angular/common';
@Component({
  selector: 'app-encuestas-respuestas',
  imports: [CommonModule, NgIf],
  templateUrl: './encuestas-respuestas.component.html',
  styleUrl: './encuestas-respuestas.component.scss',
})
export class EncuestasRespuestasComponent implements OnInit {
  encuestas: any[] = [];
  cargando = true;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.obtenerEncuestas();
  }

  async obtenerEncuestas() {
    try {
      this.encuestas = await this.authService.obtenerTodasLasEncuestas();
    } catch (error) {
      console.error('Error al obtener encuestas:', error);
    } finally {
      this.cargando = false;
    }
  }
}
