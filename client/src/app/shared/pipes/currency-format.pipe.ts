import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat'
})
export class CurrencyFormatPipe implements PipeTransform {

  transform(
    value: number | string,
    currency: string = 'THB',
    symbol: string = '฿',
    digits: string = '1.2-2'
  ): string {

    if (value === null || value === undefined) return '';

    const number = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(number)) return '';

    // format ตัวเลข
    const formatted = number.toLocaleString('th-TH', {
      minimumFractionDigits: Number(digits.split('.')[1].split('-')[0]),
      maximumFractionDigits: Number(digits.split('-')[1])
    });

    return `${symbol}${formatted}`;
  }
}
