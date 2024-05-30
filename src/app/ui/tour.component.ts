import { Component, OnInit, inject } from '@angular/core';
import { Button } from '@meeui/button';
import { TourService } from '@meeui/tour';
import { TourDemoComponent } from './tour-demo.component';
import { Heading } from '@meeui/typography';
import { Shortcuts } from '@meeui/shortcuts';

@Component({
  standalone: true,
  selector: 'app-tour',
  imports: [Button, Heading, Shortcuts],
  template: `
    <h4 meeHeader class="mb-5">Tour</h4>

    <button meeButton (click)="start()" meeShortcut="ctrl+t" (onKeys)="start()">
      Start Tour
    </button>
  `,
})
export class TourComponent implements OnInit {
  tourService = inject(TourService);
  constructor() {}

  ngOnInit() {}

  start() {
    this.tourService.start(TourDemoComponent);
    // this.ngxTour.startTour(this.dashboardTour);
  }
}
