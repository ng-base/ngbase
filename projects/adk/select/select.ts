import {
  computed,
  contentChild,
  Directive,
  inject,
  input,
  model,
  TemplateRef,
} from '@angular/core';
import { AccessibleGroup } from '@ngbase/adk/a11y';
import { filterFunction, FilterOptions, provideValueAccessor } from '@ngbase/adk/utils';
import { SelectBase } from './select-base';

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

@Directive({
  selector: '[ngbSelect]',
  providers: [_provide(NgbSelect)],
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
})
export class NgbSelect<T> extends SelectBase<T> {
  readonly search = model<string>('');
  readonly optionTemplate = contentChild(NgbSelectOption<T>);
  readonly filterFn = input((option: string) => option as string);
  readonly queryFn = input<(query: string, option: any) => boolean>();
  readonly filterOptions = input<FilterOptions<T>>();
  readonly optionsFilter = filterFunction(
    this.options,
    computed(
      () =>
        this.filterOptions() ??
        ({ filter: this.filterFn(), query: this.queryFn() } as FilterOptions<T>),
    ),
  );

  constructor() {
    super(true);
  }
}

function _provide(select: typeof NgbSelect) {
  return [{ provide: SelectBase, useExisting: select }, provideValueAccessor(select)];
}

export function aliasSelect(select: typeof NgbSelect) {
  const deps = [_provide(select), { provide: NgbSelect, useExisting: select }];
  return deps;
}
