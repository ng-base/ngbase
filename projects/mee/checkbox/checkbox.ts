import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FocusStyle } from './focus-style.directive';
import { CheckboxButton, NgbCheckbox } from '@ngbase/adk/checkbox';

@Component({
  selector: 'mee-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: NgbCheckbox,
      inputs: ['disabled', 'checked', 'indeterminate'],
      outputs: ['checkedChange', 'change'],
    },
  ],
  imports: [FormsModule, FocusStyle, CheckboxButton],
  template: `
    <button
      meeFocusStyle
      ngbCheckboxButton
      class="custom-checkbox relative flex h-b4 w-b4 flex-none items-center justify-center rounded border border-primary transition-colors"
      [class]="checkbox.disabled() ? '!border-muted bg-muted' : path() ? 'bg-primary' : ''"
    >
      @if (path(); as d) {
        <svg class="h-full w-full text-foreground" viewBox="0 0 24 24" aria-hidden="true">
          <path [attr.d]="d" stroke="currentColor" stroke-width="2" fill="none" />
        </svg>
      }
    </button>
    <ng-content />
  `,
  host: {
    class: 'inline-flex items-center gap-b2 py-1 disabled:opacity-60 disabled:cursor-not-allowed',
  },
})
export class Checkbox {
  readonly checkbox = inject(NgbCheckbox);

  readonly path = computed(() =>
    this.checkbox.indeterminate()
      ? 'M6 12L18 12'
      : this.checkbox.checked()
        ? 'M20 6L9 17L4 12'
        : '',
  );
}
