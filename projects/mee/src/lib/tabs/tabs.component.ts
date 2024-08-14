import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  TemplateRef,
  computed,
  contentChild,
  input,
  signal,
} from '@angular/core';

@Directive({
  standalone: true,
  selector: '[meeTabHeader]',
})
export class TabHeader {}

@Component({
  selector: 'mee-tab',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@if (activeMode()) {
    <ng-content></ng-content>
  }`,
  exportAs: 'meeTab',
  host: {
    class: 'block overflow-auto',
    '[class]': `active() ? 'flex-1 h-full pt-b4' : 'hidden'`,
  },
})
export class Tab {
  readonly header = contentChild(TabHeader, { read: TemplateRef });
  readonly active = signal(false);
  readonly label = input('Tab');
  readonly disabled = input(false);
  readonly mode = input<'hidden'>();
  activated = false;
  index = 0;

  activeMode = computed(() => {
    this.activated ||= this.active();
    return this.mode() ? this.activated : this.active();
  });
}
