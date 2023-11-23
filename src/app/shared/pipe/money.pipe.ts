import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'money',
})
export class MoneyPipe implements PipeTransform {
  transform(input: number | string | null | undefined, fractionSize: number = 0, symbol: string = '$'): string {
    let value = parseInt(input as string, 10);

    if (isNaN(value)) {
        return '';
    }

    return symbol + input;
  }
}
