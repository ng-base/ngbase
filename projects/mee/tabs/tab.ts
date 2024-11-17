import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChild,
  input,
  signal,
} from '@angular/core';
import { uniqueId } from '@meeui/ui/utils';

@Directive({
  selector: '[meeTabHeader]',
})
export class TabHeader {}

@Directive({
  selector: '[meeTabLazy]',
})
export class TabLazy {}

@Component({
  selector: 'mee-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  template: `@if (active() && lazy()) {
      <ng-container *ngTemplateOutlet="lazy()!" />
    } @else if (activeMode()) {
      <ng-content />
    }`,
  exportAs: 'meeTab',
  host: {
    class: 'block overflow-auto',
    '[class]': `active() ? 'flex-1 h-full pt-b4' : 'hidden'`,
    '[tabindex]': 'active() ? 0 : -1',
    role: 'tabpanel',
    '[attr.aria-hidden]': '!active()',
    '[attr.aria-labelledby]': 'id',
  },
})
export class Tab {
  // Dependencies
  readonly header = contentChild(TabHeader, { read: TemplateRef });
  readonly lazy = contentChild(TabLazy, { read: TemplateRef });

  // Inputs
  readonly label = input('Tab');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly mode = input<'hidden' | 'lazy'>();
  readonly value = input<string | number>();
  readonly id = uniqueId();
  readonly index = signal(0);
  readonly tabId = computed(() => this.value() ?? this.index());

  // State
  readonly active = signal(false);

  private activated = false;
  readonly activeMode = computed(() => {
    this.activated ||= this.active();
    return this.mode() ? this.activated : this.active();
  });
}
