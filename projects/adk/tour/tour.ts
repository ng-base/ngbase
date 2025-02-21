import { inject, contentChildren, Directive } from '@angular/core';
import { NgbTourService } from './tour.service';
import { NgbTourStep } from './tour-step';

@Directive({
  selector: '[ngbTour]',
})
export class NgbTour {
  readonly tourService = inject(NgbTourService);
  readonly steps = contentChildren(NgbTourStep, { descendants: true });
}
