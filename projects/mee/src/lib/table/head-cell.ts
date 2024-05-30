import { Component, Directive, ChangeDetectionStrategy } from '@angular/core';

@Component({
  standalone: true,
  selector: '[meeHead]',
  template: `<ng-content></ng-content>`,
  host: {
    class: 'h-b3 px-b text-left align-middle font-medium text-muted',
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
