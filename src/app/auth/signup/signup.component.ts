import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

import { AuthData } from '../auth-data.model';


@Component({
  templateUrl: './signup.component.html'
})

export class SignupComponent {
  isLoading = false;

  constructor(public authService: AuthService) {}

  onSignUp(form: NgForm) {
    const authData: AuthData = {
      email: form.value.email,
      password: form.value.password
    };

    this.authService.onCreateUser(authData);
  }
}
