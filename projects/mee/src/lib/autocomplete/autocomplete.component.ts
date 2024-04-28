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
import { SelectOption } from '../select';
import { Input } from '../input';
import { NgTemplateOutlet } from '@angular/common';
import { popoverPortal } from '../popover';
import { Subject } from 'rxjs';
import { InputStyle } from '../input/input.directive';

@Component({
  selector: 'mee-autocomplete',
  standalone: true,
  imports: [NgTemplateOutlet, InputStyle],
  template: `
    <ul #container meeInputStyle class="readonly flex">
      @for (value of dValue(); track value) {
        <li class="rounded-full bg-border px-2">
          <span>{{ value }}</span>
          <button class="text-red-600" (click)="setValue(value)">x</button>
        </li>
      }
      <li>
        <!-- <ng-content select="input"></ng-content> -->
        <input (click)="open()" class="bg-transparent" />
      </li>
    </ul>
    <ng-template #options>
      <ng-content></ng-content>
    </ng-template>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Autocomplete),
      multi: true,
    },
  ],
})
export class Autocomplete implements ControlValueAccessor {
  selectOption = contentChildren(SelectOption);
  inputContainer = contentChild(Input, { read: ElementRef });
  container = viewChild('container', { read: ElementRef });
  optionsTemplate = viewChild('options', { read: TemplateRef });
  multiple = input(false);
  values = signal<any[]>([]);
  dValue = computed(() => {
    const value = this.values()?.filter(
      (x) => x !== undefined && x !== null && x !== '',
    );
    return value;
  });
  cValue = computed(() => {
    const value = this.dValue();
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
  isOpen = false;

  constructor() {
    effect(() => {
      const options = this.selectOption();
      options.forEach((option) => {
        option.multiple = this.multiple();
        option.selectOption = () => {
          this.selectValue(option.value());
          option.checked = !option.checked;
          if (!this.multiple) {
            this.popClose();
          }
        };
      });
    });

    effect(() => {
      this.inputContainer()?.nativeElement.addEventListener(
        'click',
        (e: MouseEvent) => {
          e.stopPropagation();
          this.open();
        },
      );
    });
  }

  open() {
    if (this.isOpen) return;
    const el = this.container()!.nativeElement;
    console.log('el', el);
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
    };
  }

  selectValue(value: string): void {
    this.setValue(value);
  }

  setValue(value: string, isWrite = false): void {
    if (this.multiple()) {
      this.values.update((x) => {
        if (x.includes(value)) {
          return [...x.filter((v) => v !== value)];
        }
        return [...x, value];
      });
    } else {
      this.values.update(() => [value]);
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
