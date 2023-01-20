import { Component, OnInit } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { Post } from '../../interfaces/interfaces';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {

  post: Post[] = [];

  habillitado = true;

  constructor(private postService: PostsService) {}

  ngOnInit(): void {
    this.loadData();
  }

  doRefresh(event: Event) {
    this.loadData( event, true );
    this.habillitado = true;
    this.post = [];
  }

  loadData(event?: any, pull: boolean = false) {

    this.postService.getPosts( pull ).subscribe((resp) => {
      console.log(resp);
      this.post.push(...resp.posts);

      if (event) {
        event.target.complete();

        if ( resp .posts.length === 0 ) {
          this.habillitado = false;
        }
      }
    });
  }

  
}
