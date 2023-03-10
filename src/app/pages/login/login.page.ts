import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonSlides, NavController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';
import { UiServiceService } from '../../services/ui-service.service';
import { Usuario } from '../../interfaces/interfaces';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild('slidePrincipal') slides: IonSlides | undefined;

  loginUser = {
    email: 'test1@gmail.com',
    password: '123456'
  }

  registerUser: Usuario = {
    email: 'test3@gmail.com',
    password: '123456',
    nombre: 'Test3',
    avatar: 'av-1.png'
  }; 

  constructor( private usarioService: UsuarioService,
               private navCtrl: NavController,
               private uiService: UiServiceService ) {}

  ngOnInit() {

  }
  
  ngAfterViewInit(){
    this.slides?.lockSwipes( true );
  }

  async login( fLogin: NgForm ){

    if (fLogin.invalid) { return; }
    
    const valido = await this.usarioService.login( this.loginUser.email, this.loginUser.password );

    if (valido) {
      //Navegar al tabs
      this.navCtrl.navigateRoot('/main/tabs/tab1', { animated: true });
    } else{
      // mostrar alerta de usuario y contraseña
      this.uiService.alertaInformativa('Usuario o contraseña no son correctos');
    }
  }

  async registro( fRegistro: NgForm ){
    if ( fRegistro.invalid ) {
      return
    }

    const valido = await this.usarioService.registro(this.registerUser);
    
    if (valido) {
      //Navegar al tabs
      this.navCtrl.navigateRoot('/main/tabs/tab1', { animated: true });
    } else{
      // mostrar alerta de usuario y contraseña
      this.uiService.alertaInformativa('Este correo electrónico ya existe');
    }

  }

  
  mostrarRegistro(){
    this.slides?.lockSwipes(false);
    this.slides?.slideTo(0);
    this.slides?.lockSwipes(true);
  }

  mostrarLogin(){
    this.slides?.lockSwipes(false);
    this.slides?.slideTo(1);
    this.slides?.lockSwipes(true);
  }
}
