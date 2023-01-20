import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../interfaces/interfaces';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NgForm } from '@angular/forms';
import { UiServiceService } from 'src/app/services/ui-service.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  usuario: Usuario = {};

  constructor( private usuarioService: UsuarioService,
               private iuService: UiServiceService ) {}

  ngOnInit(): void {
    this.usuario = this.usuarioService.getUsuario();
    console.log(this.usuario);
    
  }

  async actualizar( fActualizar: NgForm ){
    if ( fActualizar.invalid ) {return;}

     const actualizado = await this.usuarioService.actualizarUsuario( this.usuario );
     console.log(actualizado);
    
     if ( actualizado ) {
      // toast con el mensaje de actualizado;
      this.iuService.presentToast('Actualizado');
     } else [
      // toast con el error;
     ]
  }


  logout(){

  }

}
