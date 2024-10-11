import {
  Directive,
  ElementRef,
  OnDestroy,
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
  booleanAttribute,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { popoverPortal } from '../popover';
import { Subject } from 'rxjs';
import { Option } from './option.component';
import { generateId } from '../utils';

@Directive()
export abstract class SelectBase<T> implements ControlValueAccessor, OnDestroy {
  // Dependencies
  el = inject(ElementRef);
  options = contentChildren(Option, { descendants: true });
  optionsTemplate = viewChild('options', { read: TemplateRef });
  container = viewChild('container', { read: ElementRef });
  optionsGroup = viewChild('optionsGroup', { read: ElementRef });

  // inputs
  value = model<any>('' as any);
  multiple = input(false, { transform: booleanAttribute });
  placeholder = input<string>(' ');
  disabled = model<boolean>(false);
  size = input<'target' | 'free'>('free');
  opened = output<boolean>();
  closed = output<boolean>();

  // state
  panelOpen = signal(false);
  readonly values = signal<T[]>([]);
  readonly status = signal<'opening' | 'opened' | 'closed'>('closed');
  onChange?: (value: any) => void;
  onTouched?: () => void;
  popClose?: VoidFunction;
  popover = popoverPortal();
  private previousValue = '';
  events = new Subject<'open' | 'close'>();
  readonly ayid = generateId();
  readonly cValue = computed(() => {
    if (!this.isSelect && this.status() === 'opened') {
      return this.previousValue;
    }
    const multiple = this.multiple();
    const options = this.options();
    const filtered = this.values(); // .filter(x => x !== undefined && x !== null && x !== '');

    const values = filtered.length
      ? options.reduce((acc, option) => {
          if (filtered.includes(option.getValue())) {
            acc.push(option.label());
          }
          return acc;
        }, [] as string[])
      : [];

    // if the value is greater than 1, then take the first value and add a plus sign with the length of the remaining values
    if (multiple && values.length > 1) {
      this.previousValue = `${values[0]} (+${values.length - 1})`;
    } else {
      this.previousValue = values[0] || '';
    }
    // console.log('select value', this.previousValue, this.values());
    return this.previousValue;
  });

  // used to determine whether the select is with in a popup
  private withInPopup = false;

  constructor(private isSelect: boolean) {
    effect(
      () => {
        const options = this.options();
        options.forEach(option => {
          option.setAyId(this.ayid);
          option.multiple.set(this.multiple());
          option.selectOption = () => {
            untracked(() => {
              this.setValue([option.getValue()]);
              option.checked.set(!option.checked());
              option.onSelectionChange.emit(option.getValue());
              if (!this.multiple()) {
                this.close();
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

    effect(
      () => {
        const values = this.values();
        const options = this.options();
        // console.log('values', this.values());

        options.forEach(option => {
          option.checked.set(values.includes(option.getValue()));
        });
      },
      { allowSignalWrites: true },
    );

    // we only have to update the value if the formcontrol is registered
    if (this.onChange) {
      effect(() => this.updateValues(this.value()), { allowSignalWrites: true });
    }
  }

  open() {
    // if the status is opened, return
    if (this.status() === 'opened') return;

    // if the options are empty, return
    if (this.options().length === 0) {
      this.status.set('opening');
      return;
    }
    const el = this.container()?.nativeElement || this.el.nativeElement;
    const { diaRef, events } = this.popover.open(this.optionsTemplate()!, {
      target: el,
      position: 'bl',
      backdrop: this.isSelect,
      width: this.size(),
      maxHeight: '400px',
      ayId: this.ayid,
      focusTrap: false,
    });
    this.withInPopup = false;

    events.subscribe(e => {
      this.withInPopup = e.type !== 'mouseleave';
    });
    if (!this.isSelect) {
      diaRef.events.subscribe(() => {
        document.addEventListener('click', this.clickHandler);
        this.events.next('open');
      });
    } else {
      this.events.next('open');
    }
    // listen for close from backdrop click
    diaRef.afterClosed.subscribe(() => {
      this.afterClose();
    });
    this.popClose = () => {
      diaRef.close();
    };
    this.afterOpen();
  }

  close() {
    this.popClose?.();
    this.popClose = undefined;
  }

  private afterOpen() {
    this.status.set('opened');
    this.opened.emit(true);
    this.panelOpen.set(true);

    // listen for focus out to close the popover
    // this.el.nativeElement.addEventListener('focusout', this.focusOut);
  }

  private afterClose() {
    this.closed.emit(true);
    this.panelOpen.set(false);

    this.status.set('closed');
    this.events.next('close');
    // stop listening for focus out
    // this.el.nativeElement.removeEventListener('focusout', this.focusOut);
    // stop listening for click
    document.removeEventListener('click', this.clickHandler);
  }

  private clickHandler = (e: MouseEvent) => {
    // if the click is in the options group, then do not close the popover
    if (!this.optionsGroup()?.nativeElement.contains(e.target as Node)) {
      this.close();
    }
  };

  private focusOut = () => {
    // settimeout is required to wait for withInPopup to be set by the popover
    requestAnimationFrame(() => {
      // if the focus is not in the popup, then close the popover
      if (!this.withInPopup) this.close();
    });
  };

  private setValue(values: T[], skip = false): void {
    console.log('setValue', values, this.values());
    let localValue = this.values();
    let setValue: any;
    if (this.multiple()) {
      values.forEach(v => {
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
      this.close();
    }
    // console.log('setValue', localValue, this.values());
    this.values.set(localValue);
    if (!skip) {
      this.onChange?.(setValue);
      this.onTouched?.();
      this.value.set(setValue);
    }
  }

  removeValue(value: T) {
    // let values = this.values();
    // const index = values.indexOf(value);
    // if (index > -1) {
    //   values = values.filter((_, i) => i === index);
    this.setValue([value]);
    // }
  }

  writeValue(value: T[] | T): void {
    console.log('writeValue', value, this.el.nativeElement.id);
    this.updateValues(value);
  }

  private updateValues(value: T[] | T) {
    this.values.set(Array.isArray(value) ? value : [value]);
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: VoidFunction): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  ngOnDestroy() {
    this.close();
  }
}
