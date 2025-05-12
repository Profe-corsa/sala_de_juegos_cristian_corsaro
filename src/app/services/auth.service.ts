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
    if (error) return false;

    const user = data.user;
    this.usuarioSubject.next(user);
    localStorage.setItem('usuario', JSON.stringify(user));

    await this.supabase.from('logs_ingreso').insert({
      email: user.email,
    });
    this.usuarioLogueado = true;
    this.router.navigate(['/bienvenido']);
    return true;
  }

  async registro(email: string, password: string): Promise<boolean> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });
    if (error || !data.user) return false;

    const user = data.user;
    this.usuarioSubject.next(user);
    localStorage.setItem('usuario', JSON.stringify(user));
    await this.supabase.from('logs_ingreso').insert({
      email: user.email,
    });
    this.usuarioLogueado = true;
    this.router.navigate(['/bienvenido']);
    return true;
  }

  logout() {
    this.supabase.auth.signOut();
    localStorage.removeItem('usuario');
    this.usuarioSubject.next(null);
    this.router.navigate(['/login']);
    this.usuarioLogueado = false;
  }

  getUsuarioActual() {
    return this.usuarioSubject.value;
  }
}
