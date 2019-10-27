import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnDestroy, OnInit {

  isAuthenticated = false;
  private postsSub: Subscription;
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 10;
  postForPage = 2;
  currentPage = 1;
  pageSize = [2, 4, 6];


  constructor(public postsService: PostsService, private authService: AuthService) {}

  ngOnInit() {
    this.postsService.getPosts(this.postForPage, this.currentPage);
    this.isLoading = true;
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: { posts: Post[], counterPosts: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.counterPosts;
        this.posts = postData.posts;
      });
    this.isAuthenticated = this.authService.isAuth();
  }

  onDelete(post: Post) {
    this.isLoading = true;
    this.postsService.deletePost(post)
      .subscribe(() => {
        this.postsService.getPosts(this.postForPage, this.currentPage);
      });
  }

  onChangePaginator(pageData: PageEvent) {
    this.isLoading = true;
    this.postForPage = pageData.pageSize;
    this.currentPage = pageData.pageIndex + 1;
    this.postsService.getPosts(this.postForPage, this.currentPage);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
