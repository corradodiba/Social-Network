import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


import { Post } from './post.model';
import { PortalHostDirective } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})

export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  navigateOnRouter(path: string) {
    if (path === '') {
      path = '/';
    }
    this.router.navigate([path]);
  }

  getPost(id: string) {
    return this.http.get<{message: string, post: {_id: string, title: string, content: string}}>(
      'http://localhost:3000/api/posts/' + id
    );
  }

  getPosts() {
    this.http
      .get<{message: string, posts: any}>(
        'http://localhost:3000/api/posts'
      )
      .pipe(map((postsData) => {
        return postsData.posts.map(post => {
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

  addPost(titlePost: string, contentPost: string, imagePost: File) {
    const postData = new FormData();
    postData.append('title', titlePost);
    postData.append('content', contentPost);
    postData.append('image', imagePost, titlePost);

    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', postData)
      .subscribe((data) => {
        const post: Post = {
          id: data.postId,
          title: titlePost,
          content: contentPost
        };
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.navigateOnRouter('');
      });
  }

  updatePost(postId: string, postTitle: string, postContent: string) {
    const post: Post = { id: postId, title: postTitle, content: postContent };
    this.http
      .put('http://localhost:3000/api/posts/' + postId, post)
      .subscribe(response => {
        const postUpdated = this.posts;
        const oldPostId = postUpdated.findIndex(elementPost => elementPost.id === post.id);
        postUpdated[oldPostId] = post;
        this.posts = postUpdated;
        this.postsUpdated.next([...this.posts]);
        this.navigateOnRouter('');
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
