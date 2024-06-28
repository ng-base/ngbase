import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  TemplateRef,
  contentChild,
  input,
  signal,
} from '@angular/core';

@Component({
  selector: 'mee-tab',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@if (active()) {
    <ng-content></ng-content>
  }`,
  exportAs: 'meeTab',
  host: {
    class: 'block overflow-auto',
    '[class]': `active() ? 'flex-1 h-full' : ''`,
  },
})
export class Tab {
  header = contentChild(TabHeader, { read: TemplateRef });
  active = signal(false);
  label = input('Tab');
  disabled = input(false);
}

@Directive({
  standalone: true,
  selector: '[meeTabHeader]',
})
export class TabHeader {}
