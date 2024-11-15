import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'range',
})
export class RangePipe implements PipeTransform {
  transform(value: number) {
    return Array.from({ length: value }, (v, k) => k + 1);
  }
}
