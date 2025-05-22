import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Usuario } from '../../classes/usuario';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ChatComponent } from "../chat/chat.component";
import { JuegosModule } from '../../juegos/juegos.module';

@Component({
  selector: 'app-bienvenido',
  imports: [RouterLink, CommonModule, ChatComponent, JuegosModule],
  templateUrl: './bienvenido.component.html',
  styleUrl: './bienvenido.component.scss',
})
export class BienvenidoComponent implements OnInit {
  public usuario: Usuario;

  constructor(private router: Router, protected auth: AuthService) {
    this.usuario = new Usuario();
    this.auth.usuario$.subscribe((user) => (this.usuario.correo = user?.email || ''));
  }
  ngOnInit(): void {

  }

  logout() {
    this.auth.logout();
  }

}
