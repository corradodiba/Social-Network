import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(public http: HttpClient) {}

  createUser(authData: AuthData) {
    this.http.post('http://localhost:3000/api/auth/signup', {
      email: authData.email,
      password: authData.password
    })
    .subscribe();
  }

  loginUser(authData: AuthData) {
    this.http.post('http://localhost:3000/api/auth/login', {
      email: authData.email,
      password: authData.password
    })
    .subscribe( (userToken) => {
      console.log(userToken);
    });
  }
}
