import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Usuario } from '../interfaces/interfaces';
import { NavController } from '@ionic/angular';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private _storage: Storage | null = null;

  token: any = null;
  private usuario: Usuario = {};

  constructor( private storage: Storage, 
               private htpp: HttpClient,
               private navCtrl: NavController
               ) { 
    this.init();
  }


  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  login(email: string, password: string ){
    const data = { email, password };

    return new Promise( resolve => {
      this.htpp.post(`${URL}/user/login`, data)
       .subscribe( (resp: any) => {
        
        console.log(resp);
        if ( resp['ok'] ) {
          this.guardarToken(resp['token']);
          resolve(true);
        } else{
          this.token = null;
          this.storage.clear();
          resolve(false);
        }

       });

    });

  }

  registro( usuario: Usuario){
    return new Promise( resolve =>{
      this.htpp.post(`${URL}/user/create`, usuario )
        .subscribe( (resp: any) => {

          console.log( resp );
          if ( resp['ok'] ) {
            this.guardarToken(resp['token']);
            resolve(true);
          } else{
            this.token = null;
            this.storage.clear();
            resolve(false);
          }

        });
    });
  }

  async guardarToken( token: string ){
    this.token = token;
    await this.storage.set('token', token);
  }

  async cargarToken(){
    this.token = await this.storage.get('token') || null;
  }

  async verificarToken(): Promise<boolean>{

    await this.cargarToken();

    if ( !this.token ) {
      this.navCtrl.navigateRoot('/login');
      return Promise.resolve(false);
    }

    return new Promise<boolean>( resolve => {

      const headers = new HttpHeaders({
        'x-token': this.token
      });

      this.htpp.get(`${URL}/user/`, { headers })
        .subscribe( ( resp: any ) => {

          if ( resp['ok'] ) {
            this.usuario = resp['usuario'];
            resolve( true );
          } else {
            this.navCtrl.navigateRoot('/login');
            resolve( false );
          }

        });
    });
  }

  getUsuario(){

    if ( !this.usuario._id ) {
      this.verificarToken();
    }
    
    return {...this.usuario};

  }

  actualizarUsuario( usuario: Usuario ){

    const headers = new HttpHeaders({
      'x-token': this.token
    });

    return new Promise( resolve => {
      this.htpp.put(`${ URL }/user/update`, usuario, { headers })
        .subscribe( (resp: any) => {
          console.log(resp);
          
          if ( resp['ok'] ) {
            this.guardarToken( resp['token'] );
            resolve(true);
          } else {
            resolve(false);
          }
  
        });

    });


  }

}
