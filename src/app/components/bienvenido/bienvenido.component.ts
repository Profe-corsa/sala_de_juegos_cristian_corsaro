import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Usuario } from '../../classes/usuario';
import { CommonModule } from '@angular/common';
import { CardJuegoComponent } from "../card-juego/card-juego.component";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-bienvenido',
  imports: [RouterLink, CommonModule, CardJuegoComponent],
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
