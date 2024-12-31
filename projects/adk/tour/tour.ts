import { inject, contentChildren, Directive } from '@angular/core';
import { MeeTourService } from './tour.service';
import { MeeTourStep } from './tour-step';

@Directive({
  selector: '[meeTour]',
})
export class MeeTour {
  readonly tourService = inject(MeeTourService);
  readonly steps = contentChildren(MeeTourStep, { descendants: true });
}
