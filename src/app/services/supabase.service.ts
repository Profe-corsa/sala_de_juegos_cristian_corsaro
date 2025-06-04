import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';

interface Mensaje {
  id?: number;
  usuario: string;
  mensaje: string;
  fecha: Date;
}

const supabaseUrl = 'https://sqfrmlidtnchlchkuhtx.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxZnJtbGlkdG5jaGxjaGt1aHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzOTk1NDQsImV4cCI6MjA2MTk3NTU0NH0.SQn4jkqmzBxEOMuhocTu_GSdjZ2zvrO_epUsfIkwx6M';

export const supabase = createClient(supabaseUrl, supabaseKey);
@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private mensajesSubject = new BehaviorSubject<Mensaje[]>([]);
  mensajes$ = this.mensajesSubject.asObservable();

  constructor() {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.inicializarMensajes();
  }

  private async inicializarMensajes() {
    const mensajes = await this.traerMensajes();
    this.mensajesSubject.next(mensajes);

    // Escuchar nuevos mensajes solo una vez
    this.supabase
      .channel('mensajes-canal')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'mensajes' },
        (payload) => {
          const nuevo = payload.new as Mensaje;
          const actual = this.mensajesSubject.value;
          this.mensajesSubject.next([...actual, nuevo]);
        }
      )
      .subscribe();
  }

  async guardarMensaje(mensaje: {
    usuario: string;
    mensaje: string;
    fecha: string;
  }) {
    const { error } = await this.supabase.from('mensajes').insert([mensaje]);

    if (error) {
      console.error('Error al guardar mensaje:', error.message);
    }
  }

  private async traerMensajes(): Promise<Mensaje[]> {
    const { data, error } = await this.supabase
      .from('mensajes')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error al traer mensajes:', error.message);
      return [];
    }

    return data || [];
  }

  escucharNuevosMensajes() {
    this.supabase
      .channel('mensajes-canal')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'mensajes' },
        () => {
          this.obtenerMensajes(); // Re-carga actualizada
        }
      )
      .subscribe();
  }

  async enviarMensaje(mensaje: string, usuario: string) {
    const { data, error } = await this.supabase.from('mensajes').insert([
      {
        mensaje: mensaje,
        usuario: usuario,
        fecha: new Date().toLocaleString('sv-SE'),
      },
    ]);
    if (error) console.error('Error al insertar mensaje:', error);
  }

  async obtenerMensajes() {
    const { data, error } = await this.supabase
      .from('mensajes')
      .select('*')
      .order('id', { ascending: true });

    if (!error && data) {
      this.mensajesSubject.next(data);
    }
  }
  /*
  formatearFecha(fecha: string) {
    return this.datePipe.transform(fecha, 'dd/MM/yyyy HH:mm');
  }
    */
}
