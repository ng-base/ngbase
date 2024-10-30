import {
  Directive,
  ElementRef,
  Injector,
  TemplateRef,
  afterNextRender,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { popoverPortal } from '../popover';
import { DatePicker } from './datepicker';
import { Input } from '../input';
import { injectMeeDateAdapter } from './native-date-adapter';

const DEFAULT_FIELD_FORMAT = 'ISO';
const DEFAULT_FORMAT = 'M/d/yyyy';
const DEFAULT_TIME_FORMAT = 'M/d/yyyy, HH:mm a';

@Directive({
  standalone: true,
  selector: '[meeDatepickerTrigger]',
  exportAs: 'meeDatepickerTrigger',
  hostDirectives: [Input],
  host: {
    class: 'cursor-pointer hover:bg-muted-background',
    '(click)': 'open()',
    readonly: 'true',
  },
})
export class DatepickerTrigger<D> {
  readonly el = inject(ElementRef);
  readonly inputS = inject(Input);
  private readonly injector = inject(Injector);
  readonly adapter = injectMeeDateAdapter<D>();
  readonly popover = popoverPortal();

  readonly datepicker = input<DatePicker<D>>();
  readonly noOfCalendars = input(1, { transform: (v: number) => Math.max(1, v) });
  readonly range = input(false, { transform: booleanAttribute });
  readonly time = input(false, { transform: booleanAttribute });
  readonly format = input<string>('');
  readonly fieldFormat = input<string>(DEFAULT_FIELD_FORMAT);
  private displayFormat = computed(() => {
    return this.format() || (this.time() ? DEFAULT_TIME_FORMAT : DEFAULT_FORMAT);
  });
  readonly dateFilter = input<(date: D) => boolean>(() => true);
  readonly pickerType = input<'date' | 'month' | 'year'>('date');
  readonly pickerTemplate = input<TemplateRef<any> | null>(null);
  close?: VoidFunction;

  constructor() {
    effect(() => {
      const value = this.getInputValue();
      this.updateField(value);
    });
  }

  private getInputValue() {
    const v = this.inputS.value() as never;
    let value: string[] = [];
    if (v) {
      value = this.range() ? v : [v];
    }
    return value.map(x => this.adapter.parse(x));
  }

  open() {
    const data: DatePickerOptions<D> = {
      value: this.getInputValue(),
      pickerType: this.pickerType(),
      noOfCalendars: this.noOfCalendars(),
      range: this.range(),
      format: this.displayFormat(),
      fieldFormat: this.fieldFormat(),
      target: this.el.nativeElement,
      template: this.pickerTemplate(),
      dateFilter: this.dateFilter(),
      time: this.time(),
    };
    const { diaRef } = this.popover.open(DatePicker, {
      target: this.el.nativeElement,
      position: 'bl',
      data,
      width: 'none',
    });
    this.close = diaRef.close;
  }

  updateInput(dates: (D | null)[]) {
    const filtered = dates.filter(x => x) as D[];
    const formatDate = dates.map(x => (x ? this.adapter.format(x, this.fieldFormat()) : x));
    if (this.range()) {
      if (filtered.length === 1) {
        return;
      }
      console.log(dates);
      this.inputS?.setValue(formatDate);
    } else if (filtered.length) {
      this.inputS?.setValue(formatDate[0]);
    }
    this.updateField(filtered);
  }

  updateField(filtered: D[]) {
    // console.log(this.fieldFormat());
    const d = filtered
      .map(x => this.adapter.format(x, this.displayFormat()))
      .filter(x => x)
      .join(' - ');
    afterNextRender(() => (this.el.nativeElement.value = d), { injector: this.injector });
  }
}

export interface DatePickerOptions<D> {
  value: D[];
  pickerType: 'date' | 'month' | 'year';
  noOfCalendars: number;
  range: boolean;
  format: string;
  fieldFormat: string;
  target: any;
  template: TemplateRef<any> | null;
  dateFilter: (date: D) => boolean;
  time: boolean;
}
