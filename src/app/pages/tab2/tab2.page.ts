import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PostsService } from 'src/app/services/posts.service';

import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { LoadingController, Platform, ToastController } from '@ionic/angular';

const IMAGE_DIR = 'stored-images';

declare var window: any;

interface LocalFile {
	name: string;
	path: string;
	data: string;
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  tempImages: string[] = [];

  images: LocalFile[] = [];

  post = {
    mensaje: '',
    coords: '',
    posicion: false,
    image: '',
  };

  cargandoGeo = false;

  constructor(
    private postsService: PostsService,
    private route: Router,
    private plt: Platform,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  async crearPost() {
    console.log(this.post);
    const creado = await this.postsService.crearPost(this.post);

    this.post = {
      mensaje: '',
      coords: '',
      posicion: false,
      image: ''
    };
    this.startUpload(this.images[0]);
    this.route.navigateByUrl('/main/tabs/tab1');
  }

  async getGeo() {
    if (!this.post.posicion) {
      this.post.coords = '';
      return;
    }

    this.cargandoGeo = true;

    const coordinates = await Geolocation.getCurrentPosition()
      .then((resp) => {
        this.cargandoGeo = false;
        const coords = `${resp.coords.latitude},${resp.coords.longitude}`;
        console.log(coords);
        this.post.coords = coords;
      })
      .catch((err) => {
        console.log('Error getting location: ', err);
        this.cargandoGeo = false;
      });

    // console.log('Current position:', coordinates);

    console.log(this.post);
  }

  async camara() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      correctOrientation: true,
      source: CameraSource.Camera,
    })
      .then((resp) => {
        console.log(resp);
        let imageUrl = resp.dataUrl || '';
        console.log(imageUrl);
        this.tempImages.push(imageUrl);
        if (resp) {
          this.saveImage(resp);
        }
      })
      .catch((err) => {
        console.error('Error getting photo: ', err);
      });

    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    // const imageUrl = image.dataUrl || '';

    // console.log(imageUrl);

    // Can be set to the src of an image now
    // imageElement.src = imageUrl;
    // this.tempImages.push(imageUrl);
  }

  async libreria() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      correctOrientation: true,
      source: CameraSource.Photos,
    })
      .then((resp) => {
        console.log(resp);
        let imageUrl = resp.dataUrl || '';
        console.log(imageUrl);
        this.tempImages.push(imageUrl);
      })
      .catch((err) => {
        console.error('Error getting photo: ', err);
      });
  }

  async loadFiles() {
    this.images = [];

    const loading = await this.loadingCtrl.create({
      message: 'Loading data...',
    });
    await loading.present();

    Filesystem.readdir({
      path: IMAGE_DIR,
      directory: Directory.Data,
    })
      .then(
        (result: any) => {
          this.loadFileData(result.files);
        },
        async (err) => {
          // Folder does not yet exists!
          await Filesystem.mkdir({
            path: IMAGE_DIR,
            directory: Directory.Data,
          });
        }
      )
      .then((_) => {
        loading.dismiss();
      });
  }

  // Get the actual base64 data of an image
  // base on the name of the file
  async loadFileData(fileNames: string[]) {
    for (let f of fileNames) {
      const filePath = `${IMAGE_DIR}/${f}`;

      const readFile = await Filesystem.readFile({
        path: filePath,
        directory: Directory.Data,
      });

      this.images.push({
        name: f,
        path: filePath,
        data: `data:image/jpeg;base64,${readFile.data}`,
      });
    }
  }

  // Little helper
  async presentToast(text: string) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 3000,
    });
    toast.present();
  }

  async selectImage() {
    // TODO
  }

  async startUpload(file: LocalFile) {
    const response = await fetch(file.data);
    const blob = await response.blob();
    const formData = new FormData();
    formData.append('file', blob, file.name);
    console.log(formData);
    
    // this.uploadData(formData);
    // this.postsService.subirImagen(formData);
  }

  async deleteImage(file: LocalFile) {
    await Filesystem.deleteFile({
      directory: Directory.Data,
      path: file.path,
    });
    this.loadFiles();
    this.presentToast('File removed.');
  }

  // Upload the formData to our API
  // async uploadData(formData: FormData) {
  //   const loading = await this.loadingCtrl.create({
  //       message: 'Uploading image...',
  //   });
  //   await loading.present();

  //   // Use your own API!
  //   const url = 'http://localhost:8888/images/upload.php';

  //   this.http.post(url, formData)
  //       .pipe(
  //           finalize(() => {
  //               loading.dismiss();
  //           })
  //       )
  //       .subscribe(res => {
  //           if (res['success']) {
  //               this.presentToast('File upload complete.')
  //           } else {
  //               this.presentToast('File upload failed.')
  //           }
  //       });
  // }

  // Create a new file from a capture image
  async saveImage(photo: Photo) {
    const base64Data = await this.readAsBase64(photo);

    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: `${IMAGE_DIR}/${fileName}`,
      data: base64Data,
      directory: Directory.Data,
    });

    // Reload the file list
    // Improve by only loading for the new image and unshifting array!
    this.loadFiles();
  }

  private async readAsBase64(photo: Photo) {
    if (this.plt.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path!,
      });

      return file.data;
    } else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();

      return (await this.convertBlobToBase64(blob)) as string;
    }
  }

  // Helper function
  convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
}
