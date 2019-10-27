import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private token: string;

  constructor(public http: HttpClient) {
    this.token = '';
  }

  getToken() {
    return this.token;
  }

  createUser(authData: AuthData) {
    this.http.post('http://localhost:3000/api/auth/signup', {
      email: authData.email,
      password: authData.password
    })
    .subscribe();
  }

  loginUser(authData: AuthData) {
    return this.http.post<{token: string}>('http://localhost:3000/api/auth/login', authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
      });
  }
}
