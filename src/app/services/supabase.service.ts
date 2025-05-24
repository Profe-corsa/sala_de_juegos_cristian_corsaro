import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sqfrmlidtnchlchkuhtx.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxZnJtbGlkdG5jaGxjaGt1aHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzOTk1NDQsImV4cCI6MjA2MTk3NTU0NH0.SQn4jkqmzBxEOMuhocTu_GSdjZ2zvrO_epUsfIkwx6M';

export const supabase = createClient(supabaseUrl, supabaseKey);
@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(supabaseUrl, supabaseKey);
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

  async traerMensajes(): Promise<any[]> {
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

  escucharNuevosMensajes(callback: (mensaje: any) => void) {
    this.supabase
      .channel('mensajes-canal')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'mensajes' },
        (payload) => {
          callback(payload.new);
        }
      )
      .subscribe();
  }

  async enviarMensaje(mensaje: string, usuario: string) {
    const { data, error } = await this.supabase.from('mensajes').insert([
      {
        mensaje: mensaje,
        usuario: usuario,
        fecha: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('Error al insertar mensaje:', error);
      return null;
    }

    return data;
  }
}
