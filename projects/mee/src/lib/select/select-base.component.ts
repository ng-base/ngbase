import {
  Directive,
  ElementRef,
  OnDestroy,
  Signal,
  TemplateRef,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { popoverPortal } from '../popover';
import { Subject } from 'rxjs';
import { Option } from './option.component';

@Directive()
export abstract class SelectBase<T> implements ControlValueAccessor, OnDestroy {
  el = inject(ElementRef);
  options = signal<readonly Option<T>[]>([]);
  optionsTemplate = viewChild('options', { read: TemplateRef });
  container = viewChild('container', { read: ElementRef });
  value = input<T>('' as any);
  multiple = input(false);
  placeholder = input<string>(' ');
  disabled = model<boolean>(false);
  size = input<'target' | 'free'>('target');
  valueChange = output<any>();
  readonly values = signal<T[]>([]);
  readonly status = signal<'opening' | 'opened' | 'closed'>('closed');
  onChange = (value: any) => {};
  onTouched = () => {};
  popClose: VoidFunction = () => {};
  popover = popoverPortal();
  private previousValue = '';
  events = new Subject<'open' | 'close'>();
  readonly cValue = computed(() => {
    if (!this.isSelect && this.status() === 'opened') {
      return this.previousValue;
    }
    const multiple = this.multiple();
    const options = this.options();
    const filtered = this.values().filter((x) => x !== undefined && x !== null && x !== '');

    const values = filtered.length
      ? options.reduce((acc, option) => {
          if (filtered.includes(option.value()!)) {
            acc.push(option.label());
          }
          return acc;
        }, [] as string[])
      : [];

    // console.log(values);
    // if the value is greater than 1, then take the first value and add a plus sign with the length of the remaining values
    if (multiple && values.length > 1) {
      this.previousValue = `${values[0]} (+${values.length - 1})`;
    } else {
      this.previousValue = values[0] || '';
    }
    return this.previousValue;
  });

  constructor(private isSelect: boolean) {
    effect(
      () => {
        const options = this.options();
        console.log('options', options, this.multiple());
        options.forEach((option) => {
          option.multiple.set(this.multiple());
          option.checked.set(this.values().includes(option.value()!));
          option.selectOption = () => {
            untracked(() => {
              this.setValue([option.value()!]);
              option.checked.set(!option.checked);
              if (!this.multiple) {
                this.popClose();
              }
            });
          };
        });
        untracked(() => {
          if (this.status() === 'opening') {
            this.open();
          }
        });
      },
      { allowSignalWrites: true },
    );
  }

  open() {
    if (this.status() === 'opened') return;
    if (this.options().length === 0) {
      this.status.set('opening');
      return;
    }
    console.log('select open', this.options().length);
    const el = this.container()?.nativeElement || this.el.nativeElement;
    const { diaRef, events } = this.popover.open(
      this.optionsTemplate()!,
      { target: el, position: 'bl' },
      {
        backdrop: this.isSelect,
        width: this.size() === 'target' ? 'target' : '',
        maxHeight: '400px',
      },
    );
    this.status.set('opened');
    let withInPopup = false;
    const clickHandler = (e: MouseEvent) => {
      if (!withInPopup) {
        this.popClose();
      }
    };
    if (!this.isSelect) {
      events.subscribe((e) => {
        withInPopup = e.type !== 'mouseleave';
      });
      diaRef.events.subscribe(() => {
        document.addEventListener('click', clickHandler);
        this.events.next('open');
      });
    }
    diaRef.afterClosed.subscribe(() => {
      this.status.set('closed');
      this.events.next('close');
    });
    this.popClose = () => {
      diaRef.close();
      document.removeEventListener('click', clickHandler);
      this.status.set('closed');
      this.events.next('close');
      // this.updateInputValue();
    };
  }

  setValue(values: T[], skip = false): void {
    let localValue = this.values();
    let setValue: any;
    if (this.multiple()) {
      values.forEach((v) => {
        const index = localValue.indexOf(v);
        if (index > -1) {
          localValue = localValue.filter((_, i) => i !== index);
        } else {
          localValue = [...localValue, v];
        }
      });
      setValue = localValue;
    } else {
      localValue = values;
      setValue = values[0];
      this.popClose();
    }
    this.values.set(localValue);
    if (!skip) {
      this.onChange(setValue);
      this.onTouched();
      this.valueChange.emit(setValue);
    }
  }

  writeValue(value: T[] | T): void {
    this.values.set(Array.isArray(value) ? value : [value]);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: VoidFunction): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  ngOnDestroy() {
    this.popClose();
  }
}
