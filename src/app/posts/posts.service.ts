import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';

@Injectable({
  providedIn: 'root'
})

export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http
      .get<{message: string, posts: any}>(
        'http://localhost:3000/api/posts'
      )
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
        });
      }))
      .subscribe((postStructure) => {
        this.posts = postStructure;
        this.postsUpdated.next([...this.posts]);
      });
    return this.posts;
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(titlePost: string, contentPost: string) {
    const post: Post = {
      id: null,
      title: titlePost,
      content: contentPost
    };

    this.http.post<{message: string}>('http://localhost:3000/api/posts', post)
      .subscribe((postData) => {
        console.log(postData.message);
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(post: Post) {
    this.http.delete('http://localhost:3000/api/posts/' + post.id)
      .subscribe(() => {
        this.posts = this.posts.filter(elementPost => elementPost.id !== post.id);
        this.postsUpdated.next([...this.posts]);
      });
  }
}
