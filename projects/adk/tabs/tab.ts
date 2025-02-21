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
import { uniqueId } from '@ngbase/adk/utils';

@Directive({
  selector: '[ngbTabHeader]',
})
export class NgbTabHeader {}

@Directive({
  selector: '[ngbTabLazy]',
})
export class NgbTabLazy {}

@Component({
  selector: 'ngb-tab',
  exportAs: 'ngbTab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  template: `
    @if (lazyTemplate(); as template) {
      <ng-container *ngTemplateOutlet="template" />
    } @else if (activeMode()) {
      <ng-content />
    }
  `,
  host: {
    role: 'tabpanel',
    '[tabindex]': 'active() ? 0 : -1',
    '[attr.aria-hidden]': '!active()',
    '[attr.aria-labelledby]': 'id',
  },
})
export class NgbTab {
  // Dependencies
  readonly header = contentChild(NgbTabHeader, { read: TemplateRef });
  readonly lazy = contentChild(NgbTabLazy, { read: TemplateRef });

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
  readonly lazyTemplate = computed(() => this.active() && this.lazy());
}

export function provideTab(tab: typeof NgbTab) {
  return {
    provide: NgbTab,
    useExisting: tab,
  };
}
