import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { DATE_FORMAT } from '../constants/local-storage.const';
@Pipe({
  name: 'dateFormat',
})
export class DateFormatPipe implements PipeTransform {
  transform(input: moment.MomentInput, format: string = DATE_FORMAT): string {
    let date = moment(input).utc();
    // let date = moment(input);
    if (!input || !date.isValid()) {
      return '';
    }

    if (format === 'full') {
      format = 'dddd, ' + DATE_FORMAT;
    }

    return date.format(format);
  }
}
