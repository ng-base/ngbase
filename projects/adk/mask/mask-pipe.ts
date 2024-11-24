import { Pipe, PipeTransform } from '@angular/core';
import { maskTransform } from './mask';

@Pipe({
  name: 'mask',
})
export class MaskPipe implements PipeTransform {
  transform(value: string, mask: string): string {
    return maskTransform(value, mask);
  }
}
