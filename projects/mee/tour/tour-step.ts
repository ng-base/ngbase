import { Directive } from '@angular/core';
import { NgbTourStep } from '@ngbase/adk/tour';

@Directive({
  selector: '[meeTourStep]',
  hostDirectives: [{ directive: NgbTourStep, inputs: ['ngbTourStep: meeTourStep'] }],
})
export class TourStep {}
