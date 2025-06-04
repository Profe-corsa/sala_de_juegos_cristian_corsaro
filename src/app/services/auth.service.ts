import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../classes/usuario';

const supabaseUrl = 'https://sqfrmlidtnchlchkuhtx.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxZnJtbGlkdG5jaGxjaGt1aHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzOTk1NDQsImV4cCI6MjA2MTk3NTU0NH0.SQn4jkqmzBxEOMuhocTu_GSdjZ2zvrO_epUsfIkwx6M';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public supabase: SupabaseClient;
  private usuarioSubject = new BehaviorSubject<User | null>(null);
  public usuario$ = this.usuarioSubject.asObservable();
  public usuarioLogueado: boolean = false;

  constructor(private router: Router) {
    this.supabase = createClient(supabaseUrl, supabaseKey);

    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this.usuarioSubject.next(JSON.parse(usuarioGuardado));
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        return 'Correo o contraseña incorrectos';
      } else if (error.message.includes('Email not confirmed')) {
        return 'Debes confirmar tu email antes de iniciar sesión';
      }else if (error.message.includes('Password should be at least 6 characters')){
        return 'La contraseña debe tener al menos 6 caracteres';
      }
        return 'Error al iniciar sesión. Intente más tarde.';
    }
  

    const user = data.user;
    this.usuarioSubject.next(user);
    localStorage.setItem('usuario', JSON.stringify(user));

    await this.supabase.from('logs_ingreso').insert({
      email: user.email,
    });
    this.usuarioLogueado = true;
    this.router.navigate(['/bienvenido']);
    return null;
  }

  async registro(email: string, password: string): Promise<string|null> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      if (error.message.includes('User already registered')) {
        return 'El correo ya está registrado';
      } else if (error.message.includes('Invalid email')) {
        return 'El correo ingresado no es válido';
      } else if (
        error.message.includes('Password should be at least 6 characters')
      ) {
        return 'La contraseña debe tener al menos 6 caracteres';
      }
      return 'Error al registrar usuario';
    }

    const user = data.user;
    this.usuarioSubject.next(user);
    localStorage.setItem('usuario', JSON.stringify(user));
    await this.supabase.from('logs_ingreso').insert({
      email: user!.email,
    });
    this.usuarioLogueado = true;
    this.router.navigate(['/bienvenido']);
    return null;
  }

  async logout(): Promise<void> {
    await this.supabase.auth.signOut();
    localStorage.removeItem('usuario');
    this.usuarioSubject.next(null);
    this.router.navigate(['/login']);
    this.usuarioLogueado = false;
  }

  getUsuarioActual() {
    return this.usuarioSubject.value;
  }

  getUsuarioActualEmail(): string {
    return this.usuarioSubject.value?.email ?? 'Desconocido';
  }

  async guardarResultado(juego: string, puntaje: number): Promise<void> {
    const user = this.usuarioSubject.value;
    if (!user) return;

    const fechaFormateada = this.getFechaFormateada();
    await this.supabase.from('resultados_juegos').insert({
      email: user.email,
      juego: juego,
      puntaje: puntaje,
      fecha: fechaFormateada,
    });
  }

  private getFechaFormateada(): string {
    const ahora = new Date();
    const dia = String(ahora.getDate()).padStart(2, '0');
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const anio = ahora.getFullYear();
    const horas = String(ahora.getHours()).padStart(2, '0');
    const minutos = String(ahora.getMinutes()).padStart(2, '0');

    return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
  }
}
