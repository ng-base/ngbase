import {
  Component,
  ChangeDetectionStrategy,
  inject,
  contentChildren,
  effect,
} from '@angular/core';
import { TourService } from './tour.service';
import { Button } from '../button';
import { TourStep } from './tour-step.directive';

@Component({
  standalone: true,
  selector: '[meeTour]',
  imports: [Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
})
export class Tour {
  tourService = inject(TourService);
  steps = contentChildren(TourStep, { descendants: true });

  constructor() {
    effect(() => {
      console.log(this.steps());
    });
  }
}
