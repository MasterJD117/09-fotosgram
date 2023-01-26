import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Post, RespuestaPosts } from '../interfaces/interfaces';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { UsuarioService } from './usuario.service';


const URL = environment.url;

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  paginaPosts = 0;

  nuevoPost = new EventEmitter<Post>();

  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService
  ) {}

  getPosts(pull: boolean = false) {
    if (pull) {
      this.paginaPosts = 0;
    }

    this.paginaPosts++;
    return this.http.get<RespuestaPosts>(
      `${URL}/posts/?pagina=${this.paginaPosts}`
    );
  }

  crearPost(post: any) {
    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token,
    });

    return new Promise((resolve) => {
      this.http
        .post<any>(`${URL}/posts`, post, { headers })
        .subscribe((resp) => {
          this.nuevoPost.emit(resp['post']);
          resolve(true);
        });
    });
  }

  subirImagen(img: FormData) {
    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token,
    });

    return new Promise((resolve) => {
      this.http.post<any>(`${URL}/posts/upload`, img, { headers });
    }).then((resp) => {
      console.log(resp);
      
    }).catch((err) => {
      console.log('Error en carga',err);
    });
  }
}
