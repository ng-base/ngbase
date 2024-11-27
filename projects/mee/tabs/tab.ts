import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
import { MeeTab, MeeTabHeader, MeeTabLazy } from '@meeui/adk/tabs';

@Directive({
  selector: '[meeTabHeader]',
  hostDirectives: [MeeTabHeader],
})
export class TabHeader {}

@Directive({
  selector: '[meeTabLazy]',
  hostDirectives: [MeeTabLazy],
})
export class TabLazy {}

@Component({
  selector: 'mee-tab',
  exportAs: 'meeTab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  providers: [{ provide: MeeTab, useExisting: Tab }],
  template: `@if (active() && lazy()) {
      <ng-container *ngTemplateOutlet="lazy()!" />
    } @else if (activeMode()) {
      <ng-content />
    }`,
  host: {
    class: 'block overflow-auto',
    '[class]': `active() ? 'flex-1 h-full pt-b4' : 'hidden'`,
  },
})
export class Tab extends MeeTab {}
