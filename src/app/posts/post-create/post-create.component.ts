import { Component, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {

  private mode = 'create';
  private postId: string;
  postToEdit: Post;

  constructor(public servicePosts: PostsService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.servicePosts.getPost(this.postId)
          .subscribe(data => {
            this.postToEdit = {
              id: data.post._id,
              title: data.post.title,
              content: data.post.content
            };
          });
      } else {
        this.mode = 'create';
        this.postId = null;
        this.postToEdit = null;
      }
    });
  }

  onSavePost(postForm: NgForm) {
    // console.dir(inputPost);
    if (postForm.invalid) { return; }

    if (this.mode === 'create') {
      this.servicePosts.addPost(postForm.value.title, postForm.value.content);
    } else {
      this.servicePosts.updatePost(
        this.postId,
        postForm.value.title,
        postForm.value.content
      );
    }

    postForm.resetForm();
  }

  getFormError(code: number) {
    const errorTitle = 'Please insert a title';
    const errorContent = 'Please insert a content';

    if (code === 1) {
      return errorTitle;
    } else { return errorContent; }
  }
}

