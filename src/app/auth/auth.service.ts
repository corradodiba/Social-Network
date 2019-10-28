import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  private token = '';

  constructor(public http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  isAuth() {
    return this.isAuthenticated;
  }

  createUser(authData: AuthData) {
    this.http.post('http://localhost:3000/api/auth/signup', {
      email: authData.email,
      password: authData.password
    })
    .subscribe();
  }

  loginUser(authData: AuthData) {
    this.http.post<{token: string}>('http://localhost:3000/api/auth/login', authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        this.authStatusListener.next(true);
        if (token) {
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.router.navigate(['/']);
        }
      });
  }

  logoutUser() {
    this.token = '';
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
  }
}
