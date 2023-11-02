import { Injectable } from '@angular/core';
import * as moment from 'moment-timezone';
@Injectable({
  providedIn: 'root',
})
export class DateService implements IDateService {
  constructor() {}

  convertStartDate(date: Date | string | undefined) {
    
    //NOTE: Removes utc from below line
    let newDate = new Date(
      moment(date).utc().local(true).toDate().toISOString()
    );
    newDate.setHours(0, 0, 0, 0);
    return newDate;

  }

  convertDate(date: Date | string | undefined) {
    let newDate = new Date(
      moment(date).utc().toDate()
    );
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  }

  convertEndDate(date: Date | string | undefined) {
    let newDate = new Date(
      moment(date).utc().local(true).toDate().toISOString()
    );
    newDate.setHours(23, 59, 59, 59);
    return newDate;
  }

  customConversion(date: Date | string, hours: any[]) {
    let newDate = new Date(
      moment(date).utc().local(true).toDate().toISOString()
    );
    if (hours && hours.length > 0) {
      newDate.setHours(hours[0], hours[1], hours[2], hours[3]);
    }
    return newDate;
  }

  convertDateToMDT(date: Date | string, format: string) {
    // return moment.tz(date, 'America/Denver').format(format);
    
    const denverMoment = moment.tz(date, 'America/Denver');
  
    // Check if Daylight Saving Time is in effect
    const isDST = denverMoment.isDST();
    
    // Subtract one hour if DST is in effect
    if (isDST) {
      denverMoment.subtract(1, 'hours');
    }
    
    return denverMoment.format(format);
  }

  convertDateToIsoStartDate(date:any) {

    const inputDate = new Date(date);
    inputDate.setSeconds(1);
    inputDate.setMilliseconds(58);

    const formattedDate = moment(inputDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

    return formattedDate;
  }

  convertDateToIsoEndDate(date:any) {

    const inputDate = new Date(date);
    inputDate.setHours(23);
    inputDate.setMinutes(59);
    inputDate.setSeconds(59);
    inputDate.setMilliseconds(58);
    const formattedDate = moment(inputDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

    return formattedDate;
  }

  getLocalISOTime(d: any) {
    function pad(n: any) {
      return n < 10 ? '0' + n : n;
    }
    if (d) {
      return (
        d.getFullYear() +
        '-' +
        pad(d.getMonth() + 1) +
        '-' +
        pad(d.getDate()) +
        'T' +
        pad(d.getHours()) +
        ':' +
        pad(d.getMinutes()) +
        ':' +
        pad(d.getSeconds()) +
        '.000Z'
      );
    } else {
      return '';
    }
  }
}

export interface IDateService {
  convertStartDate(date: string): Date;
  convertEndDate(date: string): Date;
  customConversion(date: string, hours: Array<any>): Date;
  getLocalISOTime(date: any): string;
  convertDateToMDT(date: string, format: string): string;
}
