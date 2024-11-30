import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TourStep } from '@meeui/ui/tour';
import { Child2Component } from './child-2.component';

@Component({
  selector: 'app-child-1',
  imports: [Child2Component, TourStep],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4>Child -- {{ now() }}</h4>
    <button (click)="clicked()">Click me</button>

    <app-child-2 meeTourStep></app-child-2>
  `,
  styles: ``,
})
export class Child1Component implements OnInit {
  constructor() {}

  ngOnInit() {}

  now() {
    return Date.now();
  }

  clicked() {}
}
