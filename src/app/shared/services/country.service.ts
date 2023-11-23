import { Injectable } from "@angular/core";
import { RequestService } from "./request.service";
export interface ICountry {
    name: string
    value: string
    regionFile: string
}

export interface ICountryState {
    name: string
    value: string
}
@Injectable({
    providedIn: 'root',
  })
    export class CountryService {constructor(private RequestService: RequestService) {

    }

        getCountries ()  {
            let request = {
                url: 'json/countries.json'
            };

            return this.RequestService.get(request);
        }

        getStates (country: ICountry) {
            let request = {
                url: 'json/regions/:region',
                params: {
                    region: country.regionFile + '.json'
                }
            };

            return this.RequestService.get(request);
        }
    }
