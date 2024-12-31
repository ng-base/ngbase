import { Directive } from '@angular/core';
import { MeeTour } from '@meeui/adk/tour';

@Directive({
  selector: '[meeTour]',
  hostDirectives: [MeeTour],
})
export class Tour {}
