import { HttpEvent, HttpHandler, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
  })

  export  class DefaultPaceService  {

    /* @ngInject */
    constructor() { }

    getPaces() {

        let paceValue = [];
        let lowestSeconds = 300;
        let highestSeconds = 1200;
        paceValue.push({
            title : '00:00',
            value: 0
        })
        for (let seconds = lowestSeconds; seconds <= highestSeconds; seconds += 30) {
            paceValue.push({
                title: this.secondsToHms(seconds),
                value: seconds
            })
        }
        return paceValue;
    }

    secondsToHms(secondsValue:any) {
        secondsValue = Number(secondsValue);
        var minutes = Math.floor(secondsValue % 3600 / 60);
        var seconds = Math.floor(secondsValue % 3600 % 60);

        var minutesDisplay = minutes > 0 ? (minutes.toString().match(/^\d$/) ? '0' + minutes : minutes) + (":") : "";
        var secondsDisplay = seconds > 0 ? seconds + (seconds == 1 ? "" : "") : "";
        return minutesDisplay + (secondsDisplay ? secondsDisplay : '00');
    }
}