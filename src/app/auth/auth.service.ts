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
  private tokenTimeout: any;
  private tokenDetails: {token: string, expiresIn: Date};

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
    this.http.post<{token: string, expiresIn: number}>('http://localhost:3000/api/auth/login', authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        this.authStatusListener.next(true);
        if (token) {
          this.getTokenTimeout(response.expiresIn);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const timeStamp = new Date();
          const expirationDate = new Date(timeStamp.getTime() + response.expiresIn * 1000);
          this.storeAuthData(token, expirationDate);
          this.router.navigate(['/']);
        }
      });
  }

  getTokenTimeout(expiresIn: number) {
    this.tokenTimeout = setTimeout(() => {
      this.logoutUser();
    }, expiresIn * 1000);
  }

  autoConfigAuthUser() {
    this.tokenDetails = this.getAuthStatus();
    if (!this.tokenDetails) { return; }
    const timestamp = new Date();
    const expirationDate = this.tokenDetails.expiresIn.getTime() - timestamp.getTime();
    if (expirationDate > 0) {
      this.token = this.tokenDetails.token;
      this.isAuthenticated = true;
      this.getTokenTimeout(expirationDate / 1000);
      this.authStatusListener.next(true);
    }
  }

  getAuthStatus() {
    const usertoken = localStorage.getItem('token');
    const tokenExpirationDate = localStorage.getItem('expiresIn');

    if (usertoken && tokenExpirationDate) {
      return {
        token: usertoken,
        expiresIn: new Date(tokenExpirationDate)
      };
    }
  }

  storeAuthData(token: string, expiresIn: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiresIn', expiresIn.toISOString());
  }

  clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
  }

  logoutUser() {
    this.token = '';
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimeout);
    this.clearAuthData();
    this.router.navigate(['/']);
  }
}
