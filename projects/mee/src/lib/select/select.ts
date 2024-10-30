import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronsUpDown } from '@ng-icons/lucide';
import { Icon } from '../icon';
import { InputStyle } from '../input/input-style.directive';
import { SelectBase } from './select-base';
import { AccessibleGroup } from '../a11y';
import { provideValueAccessor } from '@meeui/utils';

@Component({
  standalone: true,
  selector: 'mee-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, AccessibleGroup],
  template: `
    <button
      type="button"
      role="combobox"
      class="flex min-h-b5 w-full items-center justify-between gap-b whitespace-nowrap outline-none"
      [disabled]="disabled()"
      [class.opacity-50]="disabled()"
      tabindex="-1"
    >
      <!-- Prefix template -->
      <ng-content select=".select-prefix" />

      <span class="truncate" [class.text-muted]="!cValue()">
        <ng-content select="[meeSelectTrigger]">
          {{ cValue() || placeholder() }}
        </ng-content>
      </span>
      <mee-icon name="lucideChevronsUpDown" class="ml-b0.5 text-muted" />
    </button>

    <!-- Options template -->
    <ng-template #options>
      <div class="flex h-full flex-col overflow-hidden">
        <ng-content select="[meeSelectInput]" />
        <div
          #optionsGroup
          meeAccessibleGroup
          [ayId]="ayid"
          [isPopup]="true"
          class="overflow-auto p-b"
        >
          <div role="listbox" aria-label="Suggestions">
            <ng-content />
          </div>
        </div>
      </div>
    </ng-template>
  `,
  host: {
    class: 'flex cursor-pointer font-medium',
    '(click)': 'open()',
    '(keydown.arrowdown)': 'open()',
    '(keydown.arrowup)': 'open()',
    '(keydown.enter)': 'open()',
    '(keydown.space)': 'open()',
    '[class.pointer-events-none]': 'disabled()',
    role: 'listbox',
    type: 'button',
    '[tabindex]': 'disabled() ? -1 : 0',
  },
  hostDirectives: [InputStyle],
  viewProviders: [provideIcons({ lucideChevronsUpDown })],
  providers: [provideValueAccessor(Select)],
})
export class Select<T> extends SelectBase<T> {
  constructor() {
    super(true);
  }
}
