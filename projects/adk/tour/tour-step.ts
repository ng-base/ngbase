import { Directive, ElementRef, inject, input } from '@angular/core';
import { MeeTourService } from './tour.service';

@Directive({
  selector: '[meeTourStep]',
})
export class MeeTourStep {
  readonly el = inject<ElementRef>(ElementRef);
  readonly tourService = inject(MeeTourService);

  // Inputs
  readonly meeTourStep = input.required<string>();

  constructor() {
    this.tourService.addStep(this);
  }
}
