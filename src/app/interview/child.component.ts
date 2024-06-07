import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Child1Component } from './child-1.component';
import { TourStep } from '@meeui/tour';

@Component({
  standalone: true,
  selector: 'app-child',
  imports: [Child1Component, TourStep],
  template: `
    <h4>Child -- {{ now() }}</h4>
    <button (click)="clicked()">Click me</button>

    <app-child-1 meeTourStep></app-child-1>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChildComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  now() {
    return Date.now();
  }

  clicked() {}
}
