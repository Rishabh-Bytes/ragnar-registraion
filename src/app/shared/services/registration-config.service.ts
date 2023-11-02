import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment.staging';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class RegistrationConfigService {
    constructor(private http: HttpClient) { }
    /**
             * Get RegistrationConfig by ID
             * @id registration config id
             * @return SUCCESS
             */
    getRegistrationConfigById(id: string) {
        let url_ = environment.registrationsConfigBaseUrl + "/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");

        return this.http.get(url_).toPromise();
    }

}
