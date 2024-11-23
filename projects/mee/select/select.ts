import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  Directive,
  forwardRef,
  inject,
  model,
  TemplateRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccessibleGroup, AccessibleItem } from '@meeui/adk/a11y';
import { filterFunction, provideValueAccessor } from '@meeui/adk/utils';
import { Icon } from '@meeui/ui/icon';
import { InputStyle } from '@meeui/ui/input';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronsUpDown } from '@ng-icons/lucide';
import { Option } from './option';
import { SelectBase } from './select-base';
import { SelectInput } from './select-input';

@Directive({
  selector: '[meeSelectOption]',
  standalone: true,
})
export class SelectOption<T> {
  readonly template = inject(TemplateRef<OptionContext<T>>);
}

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
      <div class="flex flex-col overflow-hidden">
        <ng-content select="[meeSelectInput]">
          @if (optionss().length) {
            <input
              meeSelectInput
              placeholder="Search options"
              [(ngModel)]="optionsFilter.search"
              [ngModelOptions]="{ standalone: true }"
            />
          }
        </ng-content>
        <div
          #optionsGroup
          meeAccessibleGroup
          [ayId]="ayid"
          [isPopup]="true"
          [loop]="false"
          class="overflow-auto p-b"
        >
          <div class="h-full" role="listbox" aria-label="Suggestions">
            <ng-content>
              @for (option of optionsFilter.filteredList(); track option; let i = $index) {
                <mee-option [value]="option" [ayId]="ayid">
                  @if (optionTemplate(); as ot) {
                    <ng-template
                      [ngTemplateOutlet]="ot.template"
                      [ngTemplateOutletContext]="{ $implicit: option, index: i }"
                    />
                  } @else {
                    {{ option }}
                  }
                </mee-option>
              }
            </ng-content>
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

export interface OptionContext<T> {
  $implicit: T;
  index: number;
}
