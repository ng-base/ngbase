import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Slider } from '@meeui/ui/slider';

@Component({
  selector: 'app-root',
  imports: [FormsModule, Slider],
  template: ` <mee-slider [(ngModel)]="slider" [step]="1" [min]="0" [max]="200" /> `,
})
export class AppComponent {
  slider = 50;
}
