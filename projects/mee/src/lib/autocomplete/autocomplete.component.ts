import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  TemplateRef,
  contentChildren,
  contentChild,
  effect,
  forwardRef,
  viewChild,
  input,
  signal,
  computed,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Option } from '../select';
import { Input } from '../input';
import { NgTemplateOutlet } from '@angular/common';
import { popoverPortal } from '../popover';
import { Subject } from 'rxjs';
import { InputStyle } from '../input/input-style.directive';
import { Chip } from '../chip';
import { AutocompleteInput } from './autocomplete.directive';

@Component({
  selector: 'mee-autocomplete',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, InputStyle, Chip],
  template: `
    <ul
      #container
      meeInputStyle
      class="readonly !flex flex-wrap gap-2"
      (click)="prevent($event)"
    >
      <ng-content select="mee-chip" />

      <li class="flex min-w-8 flex-1 items-center" (click)="open()">
        <ng-content select="input" />
      </li>
    </ul>
    <ng-template #options>
      <ng-content />
    </ng-template>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Autocomplete),
      multi: true,
    },
  ],
})
export class Autocomplete implements ControlValueAccessor {
  selectOption = contentChildren(Option);
  inputContainer1 = contentChild(AutocompleteInput);
  chips = contentChildren(Chip);
  container = viewChild('container', { read: ElementRef });
  optionsTemplate = viewChild('options', { read: TemplateRef });
  multiple = input(false);

  readonly values = signal<any[]>([]);
  readonly dValue = computed(() => {
    const value = this.values()?.filter(
      (x) => x !== undefined && x !== null && x !== '',
    );
    return value;
  });
  readonly cValue = computed(() => {
    const value = this.dValue();
    // if the value is greater than 1, then take the first value and add a plus sign with the length of the remaining values
    if (value.length > 1) {
      return `${value[0]} (+${value.length - 1})`;
    }
    return value.length ? value[0] : '';
  });
  onChange = (value: any) => {};
  onTouched = () => {};
  popover = popoverPortal();
  popClose: VoidFunction = () => {};
  events = new Subject<'open' | 'close'>();
  isOpen = false;

  constructor() {
    effect(
      () => {
        const options = this.selectOption();
        options.forEach((option) => {
          option.multiple.set(this.multiple());
          option.checked = this.values().includes(option.value());
          option.selectOption = () => {
            this.selectValue(option.value());
            option.checked = !option.checked;
            if (!this.multiple) {
              this.popClose();
            }
          };
        });
      },
      { allowSignalWrites: true },
    );

    effect(() => this.updateInputValue());
  }

  prevent(ev: MouseEvent) {
    ev.stopPropagation();
  }

  open() {
    if (this.isOpen) return;
    const el = this.container()!.nativeElement;
    const { diaRef, events } = this.popover.open(
      this.optionsTemplate()!,
      { target: el },
      { backdrop: false, width: 'target', maxHeight: '400px' },
    );
    this.isOpen = true;
    let withInPopup = false;
    events.subscribe((e) => {
      withInPopup = e.type !== 'mouseleave';
    });
    const clickHandler = (e: MouseEvent) => {
      if (!withInPopup) {
        this.popClose();
      }
    };
    diaRef.events.subscribe(() => {
      document.addEventListener('click', clickHandler);
      this.events.next('open');
    });
    diaRef.afterClosed.subscribe(() => {
      this.isOpen = false;
      this.events.next('close');
    });
    this.popClose = () => {
      diaRef.close();
      document.removeEventListener('click', clickHandler);
      this.isOpen = false;
      this.events.next('close');
      this.updateInputValue();
    };
  }

  private updateInputValue() {
    if (!this.chips()?.length) {
      this.inputContainer1()?.updateValue(this.cValue());
    }
  }

  selectValue(value: string): void {
    this.setValue(value);
  }

  setValue(value: string): void {
    let values = this.values();
    if (this.multiple()) {
      const index = values.indexOf(value);
      if (index > -1) {
        values = values.filter((_, i) => i !== index);
      } else {
        values = [...values, value];
      }
    } else {
      values = [value];
      this.popClose();
    }
    this.values.set(values);
    this.onChange(values);
    this.onTouched();
  }

  writeValue(value: string[] | string): void {
    this.values.set(Array.isArray(value) ? value : [value]);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: VoidFunction): void {
    this.onTouched = fn;
  }
}
