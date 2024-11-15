// highlight.directive.ts
import { Directive, ElementRef, inject, input } from '@angular/core';
import { TourService } from './tour.service';

@Directive({
  selector: '[meeTourStep]',
})
export class TourStep {
  meeTourStep = input.required<string>();
  el = inject<ElementRef>(ElementRef);
  tourService = inject(TourService);

  constructor() {
    this.tourService.addStep(this);
  }
}
