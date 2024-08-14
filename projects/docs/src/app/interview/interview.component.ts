import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ChildComponent } from './child.component';
import { Tour, TourService, TourStep } from '@meeui/tour';

@Component({
  standalone: true,
  selector: 'app-interview',
  imports: [ChildComponent, Tour, TourStep],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4>Parent -- {{ now() }}</h4>
    <button (click)="clicked()">Click me</button>
    <div>
      <app-child meeTourStep></app-child>
    </div>
  `,
})
export class InterviewComponent implements OnInit {
  tourService = inject(TourService);

  constructor() {}

  ngOnInit() {}

  now() {
    return Date.now();
  }

  clicked() {}
}
