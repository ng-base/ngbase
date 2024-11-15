import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  contentChild,
  Directive,
  forwardRef,
  inject,
  input,
  model,
  TemplateRef,
} from '@angular/core';
import { AccessibleGroup, AccessibleItem } from '@meeui/ui/a11y';
import { Icon } from '@meeui/ui/icon';
import { InputStyle } from '@meeui/ui/input';
import { filterFunction, provideValueAccessor } from '@meeui/ui/utils';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronsUpDown } from '@ng-icons/lucide';
import { SelectBase } from './select-base';
import { NgTemplateOutlet } from '@angular/common';
import { Option } from './option';
import { FormsModule } from '@angular/forms';
import { SelectInput } from './select-input';

@Component({
  selector: 'mee-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Icon,
    AccessibleGroup,
    FormsModule,
    AccessibleItem,
    forwardRef(() => SelectInput),
    Option,
    NgTemplateOutlet,
  ],
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
        <!-- <ng-content select="[meeSelectInput]" /> -->
        <input
          meeSelectInput
          placeholder="Search options"
          [(ngModel)]="optionsFilter.search"
          [ngModelOptions]="{ standalone: true }"
        />
        <div
          #optionsGroup
          meeAccessibleGroup
          [ayId]="ayid"
          [isPopup]="true"
          class="overflow-auto p-b"
        >
          <div role="listbox" aria-label="Suggestions">
            <!-- <ng-content /> -->
            @for (option of optionsFilter.filteredList(); track option; let i = $index) {
              @if (optionTemplate(); as ot) {
                <ng-template
                  [ngTemplateOutlet]="ot.template"
                  [ngTemplateOutletContext]="{ $implicit: option, index: i }"
                />
              } @else {
                <mee-option [value]="option">{{ option }}</mee-option>
              }
            }
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
  readonly search = model<string>('');
  readonly optionTemplate = contentChild(SelectOption<T>);
  readonly defaultFilter = (option: string) => option;
  readonly optionsFilter = filterFunction(this.optionss, { filter: this.defaultFilter });

  constructor() {
    super(true);
  }
}

@Directive({
  selector: '[meeSelectOption]',
  standalone: true,
})
export class SelectOption<T> {
  readonly template = inject(TemplateRef<OptionContext<T>>);
}

export interface OptionContext<T> {
  $implicit: T;
  index: number;
}
