import { Component, OnInit} from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Post } from '../post.model';
import { mimeTypeValidator } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {

  private mode = 'create';
  private postId: string;
  postToEdit: Post;
  isLoading = false;
  postForm: FormGroup;
  imagePreview: string;

  constructor(public servicePosts: PostsService, private route: ActivatedRoute) {}

  ngOnInit() {

    this.postForm = new FormGroup({
      title: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(3)
        ]
      }),
      content: new FormControl(null, {
        validators: [
          Validators.required
        ]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeTypeValidator]
      })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.servicePosts.getPost(this.postId)
          .subscribe(data => {
            this.isLoading = false;
            this.postToEdit = {
              id: data.post._id,
              title: data.post.title,
              content: data.post.content,
              imagePath: data.post.imagePath
            };
            this.postForm.setValue({
              title: this.postToEdit.title,
              content: this.postToEdit.content,
              image: this.postToEdit.imagePath
            });
          });
      } else {
        this.mode = 'create';
        this.postId = null;
        this.postToEdit = null;
      }
    });
  }

  onImageAdded(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.postForm.patchValue({
      image: file
    });
    this.postForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = (reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.postForm.invalid) { return; }

    if (this.mode === 'create') {
      this.servicePosts.addPost(this.postForm.value.title, this.postForm.value.content, this.postForm.value.image);
    } else {
      this.servicePosts.updatePost(
        this.postId,
        this.postForm.value.title,
        this.postForm.value.content,
        this.postForm.value.image
      );
    }
    this.isLoading = true;
    this.postForm.reset();
  }

  getFormError(code: number) {
    const errorTitle = 'Please insert a title';
    const errorContent = 'Please insert a content';

    if (code === 1) {
      return errorTitle;
    } else { return errorContent; }
  }
}

