import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth.service'; // o tu ruta real
import { SupabaseService } from './../../services/supabase.service'; // servicio que use Supabase
import { Timestamp } from 'rxjs';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Mensaje {
  id?: number;
  usuario: string;
  mensaje: string;
  fecha: string;
}

@Component({
  selector: 'app-chat',
  imports: [NgFor, CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit {
  mensajes: Mensaje[] = [];
  nuevoMensaje: string = '';
  usuario: string = '';

  constructor(private auth: AuthService, private supabase: SupabaseService) {}

  async ngOnInit() {
    const user = this.auth.getUsuarioActualEmail(); // Devuelve el nombre del usuario
    if (user) {
      this.usuario = user;
      this.obtenerMensajes();
      this.supabase.escucharNuevosMensajes((mensaje: Mensaje) => {
        this.mensajes.push(mensaje);
      });
    }
  }

  async obtenerMensajes() {
    const data = await this.supabase.traerMensajes();
    if (data) this.mensajes = data;
  }

  async enviarMensaje() {
    if (!this.nuevoMensaje.trim()) return;

    const usuario = this.auth.getUsuarioActual()?.email || 'Anónimo';

    await this.supabase.enviarMensaje(this.nuevoMensaje, usuario);

    this.nuevoMensaje = '';
    await this.obtenerMensajes(); // Si estás refrescando la lista así
  }
}
