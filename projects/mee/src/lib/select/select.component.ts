import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronsUpDown } from '@ng-icons/lucide';
import { Icons } from '../icon';
import { InputStyle } from '../input/input-style.directive';
import { SelectBase } from './select-base.component';
import { AccessibleGroup } from '../a11y';

@Component({
  selector: 'mee-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, InputStyle, Icons, AccessibleGroup],
  template: `
    <button
      type="button"
      role="combobox"
      class="flex min-h-b5 w-full items-center justify-between gap-b whitespace-nowrap"
      [disabled]="disabled()"
      [class.opacity-50]="disabled()"
      tabindex="-1"
    >
      <ng-content select=".select-prefix"></ng-content>
      <span class="truncate" [class.text-muted]="!cValue()">
        <ng-content select="[meeSelectTrigger]">
          {{ cValue() || placeholder() }}
        </ng-content>
      </span>
      <mee-icon name="lucideChevronsUpDown" class="ml-b0.5 text-muted" />
    </button>
    <ng-template #options>
      <div meeAccessibleGroup [ayId]="ayid">
        <ng-content select="[meeSelectInput]"></ng-content>
        <div role="listbox" aria-label="Suggestions">
          <ng-content />
        </div>
      </div>
    </ng-template>
  `,
  host: {
    class: 'flex cursor-pointer font-medium',
    '(click)': 'open()',
    '[class.pointer-events-none]': 'disabled()',
    role: 'listbox',
    type: 'button',
    '[tabindex]': 'disabled() ? -1 : 0',
  },
  hostDirectives: [InputStyle],
  viewProviders: [provideIcons({ lucideChevronsUpDown })],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Select),
      multi: true,
    },
  ],
})
export class Select<T> extends SelectBase<T> {
  constructor() {
    super(true);
  }
}
