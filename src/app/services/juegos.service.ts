import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sqfrmlidtnchlchkuhtx.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxZnJtbGlkdG5jaGxjaGt1aHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzOTk1NDQsImV4cCI6MjA2MTk3NTU0NH0.SQn4jkqmzBxEOMuhocTu_GSdjZ2zvrO_epUsfIkwx6M';
@Injectable({
  providedIn: 'root',
})
export class JuegosService {
  public supabase: SupabaseClient;
  constructor() {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async obtenerTop5PorJuego(juego: string) {
    const { data, error } = await this.supabase
      .from('resultados_juegos')
      .select('email, puntaje, fecha')
      .eq('juego', juego)
      .order('puntaje', { ascending: false })
      .limit(5);

    if (error) {
      console.error(`Error al obtener el top 5 de ${juego}:`, error);
      return [];
    }

    return data ?? [];
  }
}
