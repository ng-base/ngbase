import { Directive } from '@angular/core';
import { MeeTourStep } from '@meeui/adk/tour';

@Directive({
  selector: '[meeTourStep]',
  hostDirectives: [{ directive: MeeTourStep, inputs: ['meeTourStep'] }],
})
export class TourStep {}
