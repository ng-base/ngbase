import { Directive } from '@angular/core';
import { NgbTour } from '@ngbase/adk/tour';

@Directive({
  selector: '[meeTour]',
  hostDirectives: [NgbTour],
})
export class Tour {}
