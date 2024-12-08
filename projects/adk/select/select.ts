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
import { MeeOption } from './option';
import { SelectBase } from './select-base';
import { MeeSelectInput } from './select-input';

export interface OptionContext<T> {
  $implicit: T;
  index: number;
}

@Directive({
  selector: '[meeSelectOption]',
})
export class MeeSelectOption<T> {
  readonly template = inject(TemplateRef<OptionContext<T>>);
}

@Directive({
  selector: '[meeSelectValue]',
  host: {
    type: 'button',
    role: 'combobox',
    tabindex: '-1',
    '[disabled]': 'select.disabled()',
  },
})
export class SelectValue {
  readonly select = inject(MeeSelect<any>);
}

@Directive({
  selector: '[meeSelectOptionGroup]',
  hostDirectives: [AccessibleGroup],
})
export class MeeSelectOptionGroup {
  readonly group = inject(AccessibleGroup);
  readonly select = inject(MeeSelect<any>);

  constructor() {
    this.group._isPopup.set(true);
    this.group._loop.set(false);
    this.group._ayId.set(this.select.ayid);
  }
}

@Component({
  selector: '[meeSelect]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideValueAccessor(MeeSelect)],
  imports: [
    AccessibleGroup,
    FormsModule,
    AccessibleItem,
    forwardRef(() => MeeSelectInput),
    MeeOption,
    NgTemplateOutlet,
    SelectValue,
    MeeSelectOptionGroup,
  ],
  host: {
    role: 'listbox',
    type: 'button',
    '(click)': 'open()',
    '(keydown.arrowdown)': 'open()',
    '(keydown.arrowup)': 'open()',
    '(keydown.enter)': 'open()',
    '(keydown.space)': 'open()',
    '[tabindex]': 'disabled() ? -1 : 0',
  },
  template: `
    <button
      meeSelectValue
      class="flex min-h-b5 w-full items-center justify-between gap-b whitespace-nowrap outline-none"
      [class.opacity-50]="disabled()"
    >
      <!-- Prefix template -->
      <ng-content select=".select-prefix" />

      <span class="truncate" [class.text-muted]="!cValue()">
        <ng-content select="[meeSelectTrigger]">
          {{ cValue() || placeholder() }}
        </ng-content>
      </span>
    </button>

    <!-- Options template -->
    <ng-template #options>
      <div class="flex flex-col overflow-hidden">
        <ng-content select="[meeSelectInput]">
          @if (optionss().length) {
            <input meeSelectInput placeholder="Search options" [(value)]="optionsFilter.search" />
          }
        </ng-content>
        <div #optionsGroup meeSelectOptionGroup class="overflow-auto p-b">
          <div class="h-full" role="listbox" aria-label="Suggestions">
            <ng-content>
              @for (option of optionsFilter.filteredList(); track option; let i = $index) {
                <div meeOption [value]="option" [ayId]="ayid">
                  @if (optionTemplate(); as ot) {
                    <ng-template
                      [ngTemplateOutlet]="ot.template"
                      [ngTemplateOutletContext]="{ $implicit: option, index: i }"
                    />
                  } @else {
                    {{ option }}
                  }
                </div>
              }
            </ng-content>
          </div>
        </div>
      </div>
    </ng-template>
  `,
})
export class MeeSelect<T> extends SelectBase<T> {
  readonly search = model<string>('');
  readonly optionTemplate = contentChild(MeeSelectOption<T>);
  readonly defaultFilter = (option: string) => option;
  readonly optionsFilter = filterFunction(this.optionss, { filter: this.defaultFilter });

  constructor() {
    super(true);
  }
}

export const provideSelect = (select: typeof MeeSelect) => [
  { provide: MeeSelect, useExisting: select },
  provideValueAccessor(select),
];
