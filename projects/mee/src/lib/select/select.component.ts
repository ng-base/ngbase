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
  inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Option } from './option.component';
import { NgTemplateOutlet } from '@angular/common';
import { popoverPortal } from '../popover';
import { Subject } from 'rxjs';
import { InputStyle } from '../input/input-style.directive';
import { Icons } from '../icon';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronsUpDown } from '@ng-icons/lucide';

@Component({
  selector: 'mee-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, InputStyle, Icons],
  template: `
    <button
      role="combobox"
      class="flex w-full items-center justify-between whitespace-nowrap font-medium"
    >
      <span class="truncate" [class.text-muted]="!cValue()">
        <ng-content select="[meeSelectTrigger]">
          {{ cValue() || placeholder() }}
        </ng-content>
      </span>
      <mee-icon name="lucideChevronsUpDown" class="text-muted" />
    </button>
    <ng-template #options>
      <ng-content />
    </ng-template>
  `,
  host: {
    class: 'flex cursor-pointer',
    '(click)': 'open()',
  },
  hostDirectives: [InputStyle],
  viewProviders: [provideIcons({ lucideChevronsUpDown })],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Select),
      multi: true,
    },
  ],
})
export class Select implements ControlValueAccessor {
  el = inject(ElementRef);
  selectOptions = contentChildren(Option, { descendants: true });
  optionsTemplate = viewChild('options', { read: TemplateRef });
  multiple = input<boolean>(false);
  placeholder = input<string>('');
  size = input<'target' | 'free'>('target');
  value = signal<any[]>([]);
  cValue = computed(() => {
    const multiple = this.multiple();
    const options = this.selectOptions();
    const filtered = this.value()?.filter(
      (x) => x !== undefined && x !== null && x !== '',
    );

    const values = options.reduce((acc, option) => {
      if (filtered?.includes(option.value())) {
        acc.push(option.label());
      }
      return acc;
    }, [] as string[]);

    // console.log(values);
    // if the value is greater than 1, then take the first value and add a plus sign with the length of the remaining values
    if (multiple && values.length > 1) {
      return `${values[0]} (+${values.length - 1})`;
    }
    return values[0] || '';
  });
  onChange = (value: string) => {};
  onTouched = () => {};
  popover = popoverPortal();
  popClose: VoidFunction = () => {};
  events = new Subject<'open' | 'close'>();

  constructor() {
    effect(
      () => {
        const options = this.selectOptions();
        options.forEach((option) => {
          option.multiple.set(this.multiple());
          option.checked = this.value().includes(option.value());
          option.selectOption = () => {
            this.selectValue(option.value());
            option.checked = !option.checked;
            if (!this.multiple()) {
              this.popClose();
            }
          };
        });
      },
      { allowSignalWrites: true },
    );
  }

  open() {
    const target = this.el.nativeElement;
    const { diaRef } = this.popover.open(
      this.optionsTemplate()!,
      { target, position: 'bl' },
      { width: this.size() === 'target' ? 'target' : '', maxHeight: '400px' },
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
    this.setValue(value);
  }

  setValue(value: string, isWrite = false): void {
    if (this.multiple()) {
      const index = this.value().indexOf(value);
      if (index > -1) {
        this.value.update((x) => x.filter((_, i) => i !== index));
      } else {
        this.value.update((x) => [...x, value]);
      }
    } else {
      this.value.set([value]);
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

  registerOnTouched(fn: VoidFunction): void {
    this.onTouched = fn;
  }
}
