'use strict';

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { PopUpService } from "./pop-up.service";
import { AuthService } from "./auth.service";

export interface IRequest  {
    url: string
}

export const HTTP_NOT_FOUND = 404
export const HTTP_UNPROCESSABLE_ENTITY = 422
@Injectable({
    providedIn: 'root',
})
export class RequestService {

    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;
    /* @ngInject */
    constructor(private http: HttpClient, private popUpService: PopUpService, private authService: AuthService, private router: Router) { }

    prepareResponse(response: any) {
        if (response.status === 422) {
            // this.$mdToast.show(this.$mdToast.simple().
            //     textContent(response.data['errorMessage'] ? response.data['errorMessage'] : response.data).
            //     position("bottom right"));

                this.popUpService.openSnackBar(response.data['errorMessage'] ? response.data['errorMessage'] : response.data)
            return response
        } else {
            return response
        }
    }

    prepareResponseGeneric<T>(response: any){


        if (response.status === 422) {
            const responseText = response.data;
            let result422: UnprocessableEntity | null = null;
            let resultData422 = responseText === "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            result422 = resultData422 ? UnprocessableEntity.fromJS(resultData422) : new UnprocessableEntity();
            return this.throwException("", response.status, resultData422, result422);
        } else if (response.status === 403) {
            response.data = JSON.parse(response.data);
            if (window.location.href.indexOf('team-builder') !== -1) {
                sessionStorage.removeItem('role');
                //TODO: need to add router here
                // this.$state.go('team-builder.login');
            } else {
                this.authService.logout();
            }
            const responseText = response.data;
            let result403: Forbidden | null = null;
            let resultData403 = responseText === "" ? null : responseText;
            result403 = resultData403 ? Forbidden.fromJS(resultData403) : new Forbidden();
            return this.throwException(response.data.errorMessage, response.status, responseText, result403);
        } else if (response.status === 404) {
            const responseText = response.data;
            return this.throwException("A server error occurred.", response.status, responseText);
        } else if (response.status === 500) {
            const responseText = response.data;
            let result500: ErrorDto | null = null;
            let resultData500 = responseText === "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            result500 = resultData500 ? ErrorDto.fromJS(resultData500) : new ErrorDto();
            return this.throwException("A server error occurred.", response.status, responseText, result500);
        } else if (response.status === 401) {
            if (window.location.href.indexOf('team-builder') !== -1) {
                sessionStorage.removeItem('role');
                                //TODO: need to add router here

                // this.$state.go('team-builder.login');
            } else {
                this.authService.logout();
            }
            const responseText = response.data;
            return this.throwException("Token expired.", response.status, responseText, 'error');
        } else if (response.status !== 200 && response.status !== 204) {
            const responseText = response.data;
            return this.throwException("An unexpected server error occurred.", response.status, responseText);
        }
        return null;
    }

    throwException( message: string, status: number, response: any, result?: any) {
        if (result !== null && result !== undefined) {
            if ((status === 422 || status === 401 || status === 403) && (message || response)) {
                // this.$mdToast.show(this.$mdToast.simple().
                //     textContent(message ? message : response['errorMessage']).
                //     position("bottom right"));

                    this.popUpService.openSnackBar(message ? message : response['errorMessage'])
                return response;
            } else {
                return result;
            }
        } else
            return new SwaggerException(message, status, response, null);
    }

    prepareRequest(request: IRequest): IRequest {
        request = this.fillUrlParameters(request);
        return request;
    }

    closeRequest(request: IRequest): IRequest {
        return request;
    }

    getUrlParameters(url: string): Array<string> {
        let params = url.match(/(?!:\d)(:[^\/]+)/g) || [];
        return params.map((parameter) => parameter.substr(1));
    }

    fillUrlParameters(request: any) {
        let parameters = this.getUrlParameters(request.url);

        parameters.forEach((parameter:any) => {
            request.url = request.url.replace(':' + parameter, request.params[parameter]);
            delete request.params[parameter];
        });

        return request;
    }

    get<T>(request: any) {
        request = this.prepareRequest(request);

        return this.http.get<T>(request.url).toPromise();
           
    }

    put<T>(request: any) {
        request = this.prepareRequest(request);

        return this.http.put<T>(request.url, request.data).toPromise()
            .then((response:any) => response.data)
            .catch((error:any) => this.prepareResponse(error))
            .finally(() => this.closeRequest(request));
    }

    post<T>(request: any) {
        request = this.prepareRequest(request);

        return this.http.post<T>(request.url, request.data).toPromise()
            .then((response:any) => response.data)
            .catch((error:any) => this.prepareResponse(error))
            .finally(() => this.closeRequest(request));
    }

    delete<T>(request: any){
        request = this.prepareRequest(request);

        return this.http.delete<T>(request.url).toPromise();

            // .then((response:any) => response.data)
            // .catch((error:any) => this.prepareResponse(error))
            // .finally(() => this.closeRequest(request));
    }
}


export class UnprocessableEntity implements IUnprocessableEntity {
    message?: string | undefined;
  
    constructor(data?: IUnprocessableEntity) {
      if (data) {
        for (var property in data) {
          if (data.hasOwnProperty(property))
            (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  
    init(data?: any) {
      if (data) {
        this.message = data;
      }
    }
  
    static fromJS(data: any): UnprocessableEntity {
      let result = new UnprocessableEntity();
      result.init(data);
      return result;
    }
  
    toJSON(data?: any) {
      data = typeof data === 'object' ? data : {};
      data = this.message;
      return data;
    }
  }
  
  export interface IUnprocessableEntity {
    message?: string | undefined;
  }
  
  export class Forbidden implements IForbidden {
    message?: string | undefined;
  
    constructor(data?: IForbidden) {
      if (data) {
        for (var property in data) {
          if (data.hasOwnProperty(property))
            (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  
    init(data?: any) {
      if (data) {
        this.message = data["message"];
      }
    }
  
    static fromJS(data: any): Forbidden {
      let result = new Forbidden();
      result.init(data);
      return result;
    }
  
    toJSON(data?: any) {
      data = typeof data === 'object' ? data : {};
      data["message"] = this.message;
      return data;
    }
  }
  
  export interface IForbidden {
    message?: string | undefined;
  }
  
  export class ErrorDto implements IErrorDto {
    statusCode?: number | undefined;
    message?: any | undefined;
  
    constructor(data?: IErrorDto) {
      if (data) {
        for (var property in data) {
          if (data.hasOwnProperty(property))
            (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  
    init(data?: any) {
      if (data) {
        this.statusCode = data["statusCode"];
        if (data["message"]) {
          this.message = {};
          for (let key in data["message"]) {
            if (data["message"].hasOwnProperty(key))
              this.message[key] = data["message"][key];
          }
        }
      }
    }
  
    static fromJS(data: any): ErrorDto {
      let result = new ErrorDto();
      result.init(data);
      return result;
    }
  
    toJSON(data?: any) {
      data = typeof data === 'object' ? data : {};
      data["statusCode"] = this.statusCode;
      if (this.message) {
        data["message"] = {};
        for (let key in this.message) {
          if (this.message.hasOwnProperty(key))
            data["message"][key] = this.message[key];
        }
      }
      return data;
    }
  }
  
  export interface IErrorDto {
    statusCode?: number | undefined;
    message?: any | undefined;
  }

  export class SwaggerException {
    message: string | undefined;
    status: number;
    response: string;
    result: any;
  
    constructor(message: string, status: number, response: string, result: any) {
      this.message = message;
      this.status = status;
      this.response = response;
      this.result = result;
    }
  }
  
  export class DeleteResponse implements IDeleteResponse {
    message?: string | undefined;
  
    constructor(data?: IDeleteResponse) {
      if (data) {
        for (var property in data) {
          if (data.hasOwnProperty(property))
            (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  
    init(data?: any) {
      if (data) {
        this.message = data["message"];
      }
    }
  
    static fromJS(data: any): DeleteResponse {
      let result = new DeleteResponse();
      result.init(data);
      return result;
    }
  
    toJSON(data?: any) {
      data = typeof data === 'object' ? data : {};
      data["message"] = this.message;
      return data;
    }
  }
  
  export interface IDeleteResponse {
    message?: string | undefined;
  }
  