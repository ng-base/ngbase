import { Directive, ElementRef, inject, input } from '@angular/core';
import { NgbTourService } from './tour.service';

@Directive({
  selector: '[ngbTourStep]',
})
export class NgbTourStep {
  readonly el = inject<ElementRef>(ElementRef);
  readonly tourService = inject(NgbTourService);

  // Inputs
  readonly ngbTourStep = input.required<string>();

  constructor() {
    this.tourService.addStep(this);
  }
}
