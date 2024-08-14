import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-child-2',
  template: `
    <h4>Child -- {{ now() }}</h4>
    <button (click)="clicked()">Click me</button>
  `,
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Child2Component implements OnInit {
  constructor() {}

  ngOnInit() {}

  now() {
    return Date.now();
  }

  clicked() {}
}
