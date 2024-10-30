import { Component, Directive, ChangeDetectionStrategy } from '@angular/core';

@Component({
  standalone: true,
  selector: '[meeHead]',
  template: `<ng-content />`,
  host: {
    class: 'px-b4 py-b2 text-left align-middle font-medium text-muted border-b',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Head {
  constructor() {}
}

@Directive({
  standalone: true,
  selector: '[meeHeadDef]',
})
export class HeadDef {}
