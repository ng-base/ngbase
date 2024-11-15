import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'mee-scroll-area',
  template: `<ng-content />`,
  host: {
    class: 'block overflow-auto',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollArea implements OnInit {
  constructor() {}

  ngOnInit() {}
}
