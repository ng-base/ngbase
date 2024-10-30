import { Component, ChangeDetectionStrategy, inject, contentChildren } from '@angular/core';
import { TourService } from './tour.service';
import { TourStep } from './tour-step';

@Component({
  standalone: true,
  selector: '[meeTour]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
})
export class Tour {
  tourService = inject(TourService);
  steps = contentChildren(TourStep, { descendants: true });
}
