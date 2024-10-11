import { Component, OnInit, inject } from '@angular/core';
import { Button } from '@meeui/button';
import { TourService } from '@meeui/tour';
import { TourDemoComponent } from './tour-demo.component';
import { Heading } from '@meeui/typography';

@Component({
  standalone: true,
  selector: 'app-tour',
  imports: [Button, Heading],
  template: `
    <h4 meeHeader class="mb-5">Tour</h4>

    <button meeButton (click)="start()" meeShortcut="ctrl+t" (onKeys)="start()">Start Tour</button>
  `,
})
export class TourComponent implements OnInit {
  tourService = inject(TourService);
  constructor() {}

  ngOnInit() {}

  start() {
    this.tourService.start(TourDemoComponent, [
      'theme-toggle',
      'theme-open',
      'context-menu',
      'tabs',
      'resizable',
    ]);
    // this.ngxTour.startTour(this.dashboardTour);
  }
}
