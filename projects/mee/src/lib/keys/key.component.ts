import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'mee-key, [meeKey]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    class: 'ml-auto text-xs tracking-widest opacity-60 text-muted',
  },
})
export class Key implements OnInit {
  constructor() {}

  ngOnInit() {}
}
