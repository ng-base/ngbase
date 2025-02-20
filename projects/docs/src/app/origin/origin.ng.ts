import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card } from '@meeui/ui/card';

@Component({
  selector: 'app-origin',
  standalone: true,
  imports: [Card, RouterLink],
  template: `<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    <a meeCard="outline" routerLink="slider">
      <h4 meeHeader="md">Slider</h4>
    </a>
    <a meeCard="outline" routerLink="carousel">
      <h4 meeHeader="md">Carousel</h4>
    </a>
  </div>`,
})
export default class Origin {}
