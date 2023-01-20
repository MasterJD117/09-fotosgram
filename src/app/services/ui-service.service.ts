import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UiServiceService {

  constructor( private alertCtrl: AlertController,
               private toastCtrl: ToastController ) { }


  async alertaInformativa( message: string ){
    const alert =  await this.alertCtrl.create({
      header: 'Alerta',
      // subHeader: 'subtitle',
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async presentToast( message: string ) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1500,
      position: 'top'
    });

    await toast.present();
  }

}
