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
  header = contentChild(TabHeader, { read: TemplateRef });
  active = signal(false);
  label = input('Tab');
  disabled = input(false);
  mode = input<'hidden'>();
  activated = false;
  index = 0;

  activeMode = computed(() => {
    this.activated ||= this.active();
    return this.mode() ? this.activated : this.active();
  });
}

@Directive({
  standalone: true,
  selector: '[meeTabHeader]',
})
export class TabHeader {}
