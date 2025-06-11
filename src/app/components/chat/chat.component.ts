import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from './../../services/auth.service'; 
import { SupabaseService } from './../../services/supabase.service'; 
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Mensaje {
  id?: number;
  usuario: string;
  mensaje: string;
  fecha: Date;
}

@Component({
  selector: 'app-chat',
  imports: [NgFor, CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('scroll') scrollContainer!: ElementRef;
  mensajes: Mensaje[] = [];
  nuevoMensaje: string = '';
  usuario: string = '';
  usuarioActual: string = '';

  constructor(private auth: AuthService, private supabase: SupabaseService) {}

  ngAfterViewChecked(): void {
    this.scrollAlFinal();
  }

  async ngOnInit() {
    const user = this.auth.getUsuarioActualEmail();
    if (user) {
      this.usuarioActual = user;

      this.supabase.mensajes$.subscribe((mensajes) => {
        this.mensajes = mensajes.map((m) => {
          const fechaConvertida = new Date(m.fecha);
          return {
            ...m,
            fecha: fechaConvertida,
          };
        });
      });
    }
  }

  async enviarMensaje(): Promise<void> {
    if (!this.nuevoMensaje.trim()) return;

    const email = this.auth.getUsuarioActual()?.email || 'Anónimo';
    await this.supabase.enviarMensaje(this.nuevoMensaje, email);
    this.nuevoMensaje = '';
  }

  private scrollAlFinal(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error al hacer scroll:', err);
    }
  }
}
