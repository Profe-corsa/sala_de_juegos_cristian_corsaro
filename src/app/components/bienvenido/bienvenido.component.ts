import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Usuario } from '../../classes/usuario';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ChatComponent } from '../chat/chat.component';
import { JuegosModule } from '../../juegos/juegos.module';

@Component({
  selector: 'app-bienvenido',
  standalone: true,
  imports: [RouterLink, CommonModule, ChatComponent, JuegosModule],
  templateUrl: './bienvenido.component.html',
  styleUrl: './bienvenido.component.scss',
})
export class BienvenidoComponent implements OnInit {
  public usuario: Usuario = new Usuario();

  constructor(private router: Router, protected auth: AuthService) {}

  ngOnInit(): void {
    this.auth.usuario$.subscribe((user) => {
      if (user) {
        this.usuario.correo = user.email || '';
      } else {
        // Si no hay usuario logueado, redirige al login
        this.router.navigate(['/login']);
      }
    });
  }

  logout() {
    this.auth.logout().then(() => {
      this.router.navigate(['/login']);
      console.log('Sesión cerrada');
    });
  }
}
