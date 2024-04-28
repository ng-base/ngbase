import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  TemplateRef,
  contentChildren,
  effect,
  forwardRef,
  viewChild,
  input,
  signal,
  computed,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectOption } from './select-option.component';
import { NgTemplateOutlet } from '@angular/common';
import { popoverPortal } from '../popover';
import { Subject } from 'rxjs';
import { InputStyle } from '../input/input.directive';

@Component({
  selector: 'mee-select',
  standalone: true,
  imports: [NgTemplateOutlet, InputStyle],
  template: `
    <input
      #inputContainer
      meeInputStyle
      class="readonly"
      readonly
      (click)="open()"
      [value]="cValue()"
    />
    <ng-template #options>
      <ng-content></ng-content>
    </ng-template>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Select),
      multi: true,
    },
  ],
})
export class Select implements ControlValueAccessor {
  selectOption = contentChildren(SelectOption);
  optionsTemplate = viewChild('options', { read: TemplateRef });
  inputContainer = viewChild<ElementRef>('inputContainer');
  multiple = input<boolean>(false);
  value = signal<any[]>([]);
  cValue = computed(() => {
    const value = this.value()?.filter(
      (x) => x !== undefined && x !== null && x !== '',
    );
    console.log(value);
    // if the value is greater than 1, then take the first value and add a plus sign with the length of the remaining values
    if (value.length > 1) {
      return `${value[0]} (+${value.length - 1})`;
    }
    return value[0];
  });
  onChange = (value: string) => {};
  onTouched = () => {};
  popover = popoverPortal();
  popClose: () => void = () => {};
  events = new Subject<'open' | 'close'>();

  constructor() {
    effect(() => {
      const options = this.selectOption();
      options.forEach((option) => {
        option.selectOption = () => {
          this.selectValue(option.value());
          if (this.multiple() === false) {
            this.popClose();
          }
        };
      });
    });
  }

  open() {
    const target = this.inputContainer()!.nativeElement;
    const { diaRef } = this.popover.open(
      this.optionsTemplate()!,
      { target },
      { width: 'target', maxHeight: '400px' },
    );
    diaRef.events.subscribe(() => {
      this.events.next('open');
    });
    this.popClose = () => {
      diaRef.close();
      this.events.next('close');
    };
  }

  selectValue(value: string): void {
    // if (!this.multiple()) {
    //   this.value.update(() => []);
    // }
    this.setValue(value);
  }

  setValue(value: string, isWrite = false): void {
    if (this.multiple()) {
      this.value.update((x) => [...x, value]);
    } else {
      this.value.update(() => [value]);
    }
    if (!isWrite) {
      this.onChange(value);
      this.onTouched();
    }
  }

  writeValue(value: string): void {
    this.setValue(value, true);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
