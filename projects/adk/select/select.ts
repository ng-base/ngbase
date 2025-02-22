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
import { AccessibleGroup, AccessibleItem } from '@ngbase/adk/a11y';
import { filterFunction, provideValueAccessor } from '@ngbase/adk/utils';
import { NgbOption } from './option';
import { SelectBase } from './select-base';
import { NgbSelectInput } from './select-input';

export interface OptionContext<T> {
  $implicit: T;
  index: number;
}

@Directive({
  selector: '[ngbSelectOption]',
})
export class NgbSelectOption<T> {
  readonly template = inject(TemplateRef<OptionContext<T>>);
}

@Directive({
  selector: '[ngbSelectValue]',
  host: {
    type: 'button',
    role: 'combobox',
    tabindex: '-1',
    '[disabled]': 'select.disabled()',
  },
})
export class SelectValue {
  readonly select = inject(NgbSelect<any>);
}

@Directive({
  selector: '[ngbSelectOptionGroup]',
  hostDirectives: [AccessibleGroup],
})
export class NgbSelectOptionGroup {
  readonly group = inject(AccessibleGroup);
  readonly select = inject(SelectBase<any>);

  constructor() {
    this.group._isPopup.set(true);
    this.group._loop.set(false);
    this.group._ayId.set(this.select.ayId);
  }
}

@Component({
  selector: '[ngbSelect]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [_provide(NgbSelect)],
  imports: [
    AccessibleGroup,
    FormsModule,
    AccessibleItem,
    forwardRef(() => NgbSelectInput),
    NgbOption,
    NgTemplateOutlet,
    SelectValue,
    NgbSelectOptionGroup,
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
      ngbSelectValue
      class="flex min-h-5 w-full items-center justify-between gap-1 whitespace-nowrap outline-none"
      [class.opacity-50]="disabled()"
    >
      <!-- Prefix template -->
      <ng-content select=".select-prefix" />

      <span class="truncate" [class.text-muted]="!cValue()">
        <ng-content select="[ngbSelectTrigger]">
          {{ cValue() || placeholder() }}
        </ng-content>
      </span>
    </button>

    <!-- Options template -->
    <ng-template #optionsTemplate>
      <div class="flex flex-col overflow-hidden">
        <ng-content select="[ngbSelectInput]">
          @if (options().length) {
            <input ngbSelectInput placeholder="Search options" [(value)]="optionsFilter.search" />
          }
        </ng-content>
        <div #optionsGroup ngbSelectOptionGroup class="overflow-auto p-1">
          <div class="h-full" role="listbox" aria-label="Suggestions">
            <ng-content>
              @for (option of optionsFilter.filteredList(); track option; let i = $index) {
                <div ngbOption [value]="option" [ayId]="ayId">
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
export class NgbSelect<T> extends SelectBase<T> {
  readonly search = model<string>('');
  readonly optionTemplate = contentChild(NgbSelectOption<T>);
  readonly defaultFilter = (option: string) => option;
  readonly optionsFilter = filterFunction(this.options, { filter: this.defaultFilter });

  constructor() {
    super(true);
  }
}

function _provide(select: typeof NgbSelect) {
  return [{ provide: SelectBase, useExisting: select }, provideValueAccessor(select)];
}

export function provideSelect(select: typeof NgbSelect) {
  const deps = [_provide(select), { provide: NgbSelect, useExisting: select }];
  return deps;
}
