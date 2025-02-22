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
import { AccessibleItem } from '@ngbase/adk/a11y';
import { NgbRadioGroup } from './radio-group';

@Component({
  selector: '[ngbRadioIndicator]',
  exportAs: 'ngbRadioIndicator',
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
export class NgbRadioIndicator {
  readonly radio = inject(NgbRadio);
  readonly allyItem = inject(AccessibleItem);
  readonly disabled = linkedSignal(this.radio.disabled);

  constructor() {
    this.allyItem._ayId.set(this.radio.ayId);
    this.allyItem._disabled = this.disabled;
  }
}

@Directive({
  selector: '[ngbRadio]',
  // template: `
  //   <button
  //     ngbFocusStyle
  //     ngbRadioIndicator
  //     class="custom-radio relative flex h-4 w-4 flex-none items-center justify-center rounded-full border border-primary"
  //     [class]="disabled() ? 'border-muted' : 'border-primary'"
  //   >
  //     @if (checked()) {
  //       <div class="h-2 w-2 rounded-full" [class]="disabled() ? 'bg-muted' : 'bg-primary'"></div>
  //     }
  //   </button>
  //   <ng-content />
  // `,
  host: {
    class: 'ngb-radio',
    '(click)': '!disabled() && updateValue($event)',
    '[attr.aria-disabled]': 'disabled()',
    // '[class]': `disabled() ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'`,
  },
})
export class NgbRadio {
  readonly radio = inject(NgbRadioGroup);
  readonly value = input<any>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly checked = computed(() => this.value() === this.radio.value());
  readonly ayId = this.radio.ayId;

  updateValue() {
    this.radio.updateValue(this.value());
  }
}
