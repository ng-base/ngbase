import { Directive, ElementRef, TemplateRef, computed, effect, inject, input } from '@angular/core';
import { popoverPortal } from '../popover';
import { DatePicker } from './datepicker.component';
import { Input } from '../input';
import { injectMeeDateAdapter } from './native-date-adapter';

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
  },
})
export class DatepickerTrigger<D> {
  el = inject(ElementRef);
  datepicker = input<DatePicker<D>>();
  noOfCalendars = input(1, { transform: (v: number) => Math.max(1, v) });
  range = input(false);
  time = input(false);
  format = input<string>('');
  private fieldFormat = computed(() => {
    return this.format() || (this.time() ? DEFAULT_TIME_FORMAT : DEFAULT_FORMAT);
  });
  inputS = inject(Input);
  dateFilter = input<(date: D) => boolean>(() => true);
  pickerType = input<'date' | 'month' | 'year'>('date');
  pickerTemplate = input<TemplateRef<any> | null>(null);
  adapter = injectMeeDateAdapter<D>();
  popover = popoverPortal();
  close?: VoidFunction;

  constructor() {
    effect(
      () => {
        const value = this.getInputValue();
        this.updateField(value);
      },
      { allowSignalWrites: true },
    );
  }

  private getInputValue() {
    const v = this.inputS.value();
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
      format: this.fieldFormat(),
      target: this.el.nativeElement,
      template: this.pickerTemplate(),
      dateFilter: this.dateFilter(),
      time: this.time(),
    };
    const { diaRef } = this.popover.open(
      DatePicker,
      { target: this.el.nativeElement, position: 'bl' },
      { data, width: 'none' },
    );
    this.close = diaRef.close;
  }

  updateInput(dates: (D | null)[]) {
    const filtered = dates.filter(x => x) as D[];
    if (this.range()) {
      if (filtered.length === 1) {
        return;
      }
      this.inputS?.setValue(dates);
    } else if (filtered.length) {
      this.inputS?.setValue(dates[0]);
    }
    this.updateField(filtered);
  }

  updateField(filtered: D[]) {
    // console.log(this.fieldFormat());
    const d = filtered
      .map(x => this.adapter.format(x, this.fieldFormat()))
      .filter(x => x)
      .join(' - ');
    requestAnimationFrame(() => {
      this.el.nativeElement.value = d;
    });
  }
}

export interface DatePickerOptions<D> {
  value: D[];
  pickerType: 'date' | 'month' | 'year';
  noOfCalendars: number;
  range: boolean;
  format: string;
  target: any;
  template: TemplateRef<any> | null;
  dateFilter: (date: D) => boolean;
  time: boolean;
}
