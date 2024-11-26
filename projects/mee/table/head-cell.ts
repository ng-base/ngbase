import { Component, Directive, ChangeDetectionStrategy } from '@angular/core';
import { MeeHead, MeeHeadDef } from '@meeui/adk/table';

@Component({
  selector: '[meeHead]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'px-b4 py-b2 text-left align-middle font-medium text-muted border-b',
  },
  hostDirectives: [MeeHead],
  template: `<ng-content />`,
})
export class Head {}

@Directive({
  selector: '[meeHeadDef]',
  hostDirectives: [MeeHeadDef],
})
export class HeadDef {}
