import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { IRedirectParams } from '../helper/interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = environment.profilesBaseUrl;
  private redirectParams: IRedirectParams
  constructor(private http: HttpClient) {

    // ,
    //   ;

    // if (user) {
    //   this.user = JSON.parse(user);
    // }

    // if (redirectParams) {
    //   this.redirectParams = JSON.parse(redirectParams);
    // }
  }

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

  getUser() {
    let user: any = sessionStorage.getItem('user');
    return JSON.parse(user);
  }

  setRedirectParams(stateName: string, params: Object = {}): void {
    this.redirectParams = {
      stateName: stateName,
      params: params
    };

    sessionStorage.setItem('redirect-params', JSON.stringify(this.redirectParams));
  }

  getRedirectParams() {
    let redirectParams: any = sessionStorage.getItem('redirect-params')
    return JSON.parse(redirectParams);
  }

  createUser(user: User) {

    const url = this.apiUrl + '/apiCreateUser'
    const content = user;

    return this.http.post(url, content).toPromise();

  }

  /**
   * Update Profiles ID.
   * @email email
   * @profilesId profiles Id
   * @return SUCCESS
  */
  updateProfileId(email: string, profilesId: string) {
    let url_ = this.apiUrl + "/registrations/updateProfileId";

    if (email === undefined || email === null)
      throw new Error("The parameter 'email' must be defined.");
    if (profilesId === undefined || profilesId === null)
      throw new Error("The parameter 'profilesId' must be defined.");

    const content_ = { "email": email, "profilesId": profilesId };

    return this.http.put(url_, content_).toPromise();
  }

  logout(): void {

  }

  getVipCode() {
    return null;
  }
}
