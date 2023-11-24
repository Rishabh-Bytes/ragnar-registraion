import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { HttpClient } from '@angular/common/http';
export interface ICountry {
  name: string;
  value: string;
  regionFile: string;
}

export interface ICountryState {
  name: string;
  value: string;
}
@Injectable({
  providedIn: 'root',
})
export class CountryService {
  constructor(
    private RequestService: RequestService,
    private http: HttpClient
  ) {}

  getCountries() {
    let url = `assets/json/countries.json`;
    url = encodeURI(url);
    return this.http.get<ICountry[]>(url, { headers: { skip: 'true' } });
  }

  getStates(country: ICountry) {
    let url = `assets/json/regions/${country.regionFile}.json`;
    url = encodeURI(url);
    return this.http.get<ICountryState[]>(url, { headers: { skip: 'true' } });
  }
}
