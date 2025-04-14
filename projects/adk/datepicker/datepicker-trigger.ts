import {
  Directive,
  ElementRef,
  InjectionToken,
  Injector,
  Signal,
  TemplateRef,
  afterNextRender,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { InputBase } from '@ngbase/adk/form-field';
import { ngbPopoverPortal } from '@ngbase/adk/popover';
import { NgbDatePicker } from './datepicker';
import { injectNgbDateAdapter } from './native-date-adapter';
import { NgbSelectTarget } from '@ngbase/adk/select';

const DEFAULT_FIELD_FORMAT = 'ISO';
const DEFAULT_FORMAT = 'M/d/yyyy';
const DEFAULT_TIME_FORMAT = 'M/d/yyyy, HH:mm a';

const DatePicker = new InjectionToken<typeof NgbDatePicker>('DatePicker');

@Directive({
  selector: '[ngbEndDate]',
  exportAs: 'ngbEndDate',
  hostDirectives: [{ directive: InputBase, inputs: ['value'], outputs: ['valueChange'] }],
  host: {
    '(click)': 'open()',
  },
})
export class NgbEndDate<D> {
  readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);
  readonly inputS = inject(InputBase);
  readonly ngbEndDate = input.required<NgbDatepickerTrigger<D>>();
  hidden = false;

  constructor() {
    effect(() => {
      this.ngbEndDate().endDate = this;
    });
  }
}

@Directive({
  selector: '[ngbDatepickerTrigger]',
  exportAs: 'ngbDatepickerTrigger',
  hostDirectives: [{ directive: InputBase, inputs: ['value'], outputs: ['valueChange'] }],
  host: {
    '(click)': 'open()',
    readonly: 'true',
  },
})
export class NgbDatepickerTrigger<D> {
  readonly el = inject(ElementRef);
  readonly inputS = inject(InputBase);
  readonly target = inject(NgbSelectTarget, { optional: true });
  private readonly injector = inject(Injector);
  readonly adapter = injectNgbDateAdapter<D>();
  readonly popover = ngbPopoverPortal();
  private datepicker =
    inject<typeof NgbDatePicker<D>>(DatePicker, { optional: true }) ?? NgbDatePicker<D>;

  // readonly datepicker = input<NgbDatePicker<D>>();
  readonly noOfCalendars = input(1, { transform: (v: number | string) => Math.max(1, Number(v)) });
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
  private readonly inputValue = computed(() => this.getInputValue());
  endDate?: NgbEndDate<D>;

  constructor() {
    effect(() => {
      const value = this.inputValue();
      this.updateField(value);
    });
  }

  private getInputValue() {
    const v = this.inputS.value() as never;
    const e = this.endDate?.inputS.value() as never;
    let value: string[] = [];
    if (v) {
      value = Array.isArray(v) ? v : [v];
    }
    if (e) {
      value[1] = e;
    }
    return value.map(x => this.adapter.parse(x));
  }

  open() {
    const target = this.target?.target() || this.el.nativeElement;
    const data: DatePickerOptions<D> = {
      target,
      value: this.inputValue,
      pickerType: this.pickerType(),
      noOfCalendars: this.noOfCalendars(),
      range: this.range(),
      format: this.displayFormat(),
      fieldFormat: this.fieldFormat(),
      template: this.pickerTemplate(),
      dateFilter: this.dateFilter(),
      time: this.time(),
    };
    const { diaRef } = this.popover.open(this.datepicker, {
      target,
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
      if (filtered.length < 2) {
        return;
      }
      if (this.endDate) {
        this.inputS.setValue(formatDate[0], true);
        this.endDate.inputS.setValue(formatDate[1], true);
      } else {
        this.inputS?.setValue(formatDate, true);
      }
    } else if (filtered.length) {
      this.inputS?.setValue(formatDate[0], true);
    }
    this.updateField(filtered);
  }

  updateField(filtered: D[]) {
    // console.log(this.fieldFormat());
    const d = filtered.map(x => this.adapter.format(x, this.displayFormat())).filter(x => x);
    afterNextRender(
      () => {
        if (this.endDate && !this.endDate.hidden) {
          this.el.nativeElement.value = d[0] || '';
          this.endDate.el.nativeElement.value = d[1] || '';
        } else {
          this.el.nativeElement.value = d.join(' - ');
        }
      },
      { injector: this.injector },
    );
  }
}

export function aliasDatePickerTrigger<D>(trigger: typeof NgbDatepickerTrigger<D>) {
  return { provide: NgbDatepickerTrigger, useExisting: trigger };
}

export interface DatePickerOptions<D> {
  value: Signal<D[]>;
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

export function registerDatePicker<D>(datePicker: typeof NgbDatePicker<D>) {
  return {
    provide: DatePicker,
    useValue: datePicker,
  };
}
