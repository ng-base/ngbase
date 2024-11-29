import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { AccessibleItem } from '@meeui/adk/a11y';
import { MeeRadioGroup } from './radio-group';

@Component({
  selector: '[meeRadioIndicator]',
  exportAs: 'meeRadioIndicator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [AccessibleItem],
  template: `
    @if (radio.checked()) {
      <ng-content />
    }
  `,
  host: {
    type: 'button',
    role: 'radio',
    '[attr.aria-checked]': 'radio.checked()',
  },
})
export class MeeRadioIndicator {
  readonly radio = inject(MeeRadio);
  readonly allyItem = inject(AccessibleItem);
  readonly disabled = linkedSignal(this.radio.disabled);

  constructor() {
    this.allyItem._ayId.set(this.radio.ayId);
    this.allyItem._disabled = this.disabled;
  }
}

@Directive({
  selector: '[meeRadio]',
  // template: `
  //   <button
  //     meeFocusStyle
  //     meeRadioIndicator
  //     class="custom-radio relative flex h-b4 w-b4 flex-none items-center justify-center rounded-full border border-primary"
  //     [class]="disabled() ? 'border-muted' : 'border-primary'"
  //   >
  //     @if (checked()) {
  //       <div class="h-b2 w-b2 rounded-full" [class]="disabled() ? 'bg-muted' : 'bg-primary'"></div>
  //     }
  //   </button>
  //   <ng-content />
  // `,
  host: {
    class: 'mee-radio',
    '(click)': '!disabled() && updateValue($event)',
    '[attr.aria-disabled]': 'disabled()',
    // '[class]': `disabled() ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'`,
  },
})
export class MeeRadio {
  readonly radio = inject(MeeRadioGroup);
  readonly value = input<any>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly checked = computed(() => this.value() === this.radio.value());
  readonly ayId = this.radio.ayId;

  updateValue() {
    this.radio.updateValue(this.value());
  }
}
