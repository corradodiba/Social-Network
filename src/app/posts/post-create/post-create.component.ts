import { Component} from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';

import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent {

  constructor(public servicePosts: PostsService) {}

  onAddPost(postForm: NgForm) {
    // console.dir(inputPost);
    if (postForm.invalid) { return; }
    this.servicePosts.addPost(postForm.value.title, postForm.value.content);
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

