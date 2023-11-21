import { HttpEvent, HttpHandler, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
  })

  export class BaseDataService {

    /* @ngInject */
    constructor () {}

    // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //     let token = localStorage.getItem('jwtToken-admin');
    //     let redirectParams:any = JSON.parse(sessionStorage.getItem('redirect-params')) || null;   
    //     if(window.location.href.indexOf('team-builder') !== -1) {
    //         token = localStorage.getItem('jwtToken-user');
    //     }
    // }


    transformOptions(options: any){
        let token = localStorage.getItem('jwtToken-admin');
        // let redirectParams = JSON.parse(sessionStorage.getItem('redirect-params')) || null;
        
        if(window.location.href.indexOf('team-builder') !== -1) {
            token = localStorage.getItem('jwtToken-user');
        }

        if (options.headers) {
            options.headers['x-api-key'] = environment.apiKey;
            options.headers['Authorization'] = token;
        } else {
            options.headers = {
                'x-api-key': environment.apiKey,
                'Authorization' : token
            }
        }

        return options;
    }
}