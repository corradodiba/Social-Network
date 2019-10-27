import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private authStatusListener = new Subject<boolean>();
  private token = '';

  constructor(public http: HttpClient) {}

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener;
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
        this.authStatusListener.next(true);
      });
  }
}
