import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sqfrmlidtnchlchkuhtx.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxZnJtbGlkdG5jaGxjaGt1aHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzOTk1NDQsImV4cCI6MjA2MTk3NTU0NH0.SQn4jkqmzBxEOMuhocTu_GSdjZ2zvrO_epUsfIkwx6M';


@Injectable({
  providedIn: 'root',
})
export class PalabraService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      supabaseUrl,
      supabaseKey
    );
  }

  async getRandomWord(): Promise<string> {
    const { data, error } = await this.supabase.from('palabras').select('palabra');

    if (error) {
      console.error('Error al obtener palabras:', error.message);
      throw new Error('Error al obtener palabras');
    }

    if (!data || data.length === 0) {
      throw new Error('No hay palabras disponibles en la tabla.');
    }

    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex].palabra;
  }
}
