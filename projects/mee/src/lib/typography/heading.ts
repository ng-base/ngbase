import { Directive, input } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[meeHeader]',
  host: {
    '[class]': `'font-semibold ' + (meeHeader() == 'sm' 
    ? 'text-2xl' 
    : meeHeader() == 'md' 
      ? 'text-3xl' 
      : meeHeader() == 'lg' 
      ? 'text-4xl' 
      : meeHeader() == 'xs'
        ? 'text-base font-semibold' 
        : '!font-medium')`,
  },
})
export class Heading {
  meeHeader = input<'xs' | 'sm' | 'md' | 'lg' | ''>();
}
