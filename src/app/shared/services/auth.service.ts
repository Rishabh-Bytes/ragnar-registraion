import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = environment.profilesBaseUrl;
  constructor(private http: HttpClient) {}

  login(loginDetails: any, userType: string) {
    console.log('adaddasasdas', loginDetails, userType);
    return this.http.post(
      this.apiUrl + '/login?userType=' + userType,
      loginDetails
    );
  }

  setUser(user: User): void {
    sessionStorage.setItem('user', JSON.stringify(user));
  }
}
