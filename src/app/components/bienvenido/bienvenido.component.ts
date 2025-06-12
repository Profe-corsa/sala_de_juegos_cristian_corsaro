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
  public esAdmin: boolean = false;

  constructor(private router: Router, protected auth: AuthService) {}

  async ngOnInit(){
    this.auth.usuario$.subscribe(async (user) => {
      if (user) {
        this.usuario.correo = user.email || '';

        // Verificamos el rol admin con el ID del usuario ya cargado
        const esAdmin = await this.auth.usuarioEsAdmin();

        // Mostramos el botón si tiene rol admin o si es prop@prop.com
        this.esAdmin = esAdmin;
      } else {
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
