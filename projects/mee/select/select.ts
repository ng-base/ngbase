import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MeeSelect,
  MeeSelectOption,
  MeeSelectOptionGroup,
  provideSelect,
  SelectValue,
} from '@meeui/adk/select';
import { Icon } from '@meeui/ui/icon';
import { InputStyle } from '@meeui/ui/form-field';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronsUpDown } from '@ng-icons/lucide';
import { Option } from './option';
import { SelectInput } from './select-input';

@Directive({
  selector: '[meeSelectOption]',
  hostDirectives: [MeeSelectOption],
})
export class SelectOption<T> {}

@Component({
  selector: 'mee-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [InputStyle],
  viewProviders: [provideIcons({ lucideChevronsUpDown })],
  providers: [provideSelect(Select)],
  imports: [
    Icon,
    FormsModule,
    SelectInput,
    Option,
    NgTemplateOutlet,
    SelectValue,
    MeeSelectOptionGroup,
  ],
  template: `
    <button
      meeSelectValue
      [class.opacity-50]="disabled()"
      class="flex min-h-b5 w-full items-center justify-between gap-b whitespace-nowrap outline-none"
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
    <ng-template #optionsTemplate>
      <div class="flex flex-col overflow-hidden">
        <ng-content select="[meeSelectInput]">
          @if (options().length) {
            <input
              meeSelectInput
              placeholder="Search options"
              [(ngModel)]="optionsFilter.search"
              [ngModelOptions]="{ standalone: true }"
            />
          }
        </ng-content>
        <div #optionsGroup meeSelectOptionGroup class="overflow-auto p-b">
          <div class="h-full" role="listbox" aria-label="Suggestions">
            <ng-content>
              @for (option of optionsFilter.filteredList(); track option; let i = $index) {
                <mee-option [value]="option" [ayId]="ayId">
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
        <ng-content select=".select-footer" />
      </div>
    </ng-template>
  `,
  host: {
    class: 'flex cursor-pointer font-medium',
    '[class.pointer-events-none]': 'disabled()',
  },
})
export class Select<T> extends MeeSelect<T> {}
