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
  output,
  untracked,
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
import { SelectBase } from './select-base.component';

@Component({
  selector: 'mee-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, InputStyle, Icons],
  template: `
    <button
      type="button"
      role="combobox"
      class="flex min-h-b5 w-full items-center justify-between whitespace-nowrap"
      [disabled]="disabled()"
      [class.opacity-50]="disabled()"
    >
      <span class="truncate" [class.text-muted]="!cValue()">
        <ng-content select="[meeSelectTrigger]">
          {{ cValue() || placeholder() }}
        </ng-content>
      </span>
      <mee-icon name="lucideChevronsUpDown" class="ml-b0.5 text-muted" />
    </button>
    <ng-template #options>
      <ng-content />
    </ng-template>
  `,
  host: {
    class: 'flex cursor-pointer font-medium',
    '(click)': 'open()',
    '[class.pointer-events-none]': 'disabled()',
    role: 'listbox',
    type: 'button',
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
export class Select<T> extends SelectBase<T> {
  // el = inject(ElementRef);
  // selectOptions = contentChildren(Option, { descendants: true });
  // placeholder = input<string>(' ');
  // disabled = input<boolean>(false);
  // localValue = signal<any[]>([]);
  // cValue = computed(() => {
  //   const multiple = this.multiple();
  //   const options = this.selectOptions();
  //   const filtered = this.localValue()?.filter(x => x !== undefined && x !== null && x !== '');

  //   const values = options.reduce((acc, option) => {
  //     if (filtered?.includes(option.value())) {
  //       acc.push(option.label());
  //     }
  //     return acc;
  //   }, [] as string[]);

  //   // console.log(values);
  //   // if the value is greater than 1, then take the first value and add a plus sign with the length of the remaining values
  //   if (multiple && values.length > 1) {
  //     return `${values[0]} (+${values.length - 1})`;
  //   }
  //   return values[0] || '';
  // });
  // onChange = (value: any) => {};
  // onTouched = () => {};
  // popover = popoverPortal();
  // popClose: VoidFunction = () => {};
  // events = new Subject<'open' | 'close'>();
  // value = input<any>();
  // valueChange = output<any>();

  constructor() {
    super(true);
    // effect(() => this.options.set(this.selectOptions()), { allowSignalWrites: true });
    // effect(
    //   () => {
    //     const options = this.selectOptions();
    //     options.forEach(option => {
    //       option.multiple.set(this.multiple());
    //       // untracked(() => {
    //       option.checked.set(this.localValue().includes(option.value()));
    //       option.selectOption = () => {
    //         this.selectValue(option.value());
    //         option.checked.set(!option.checked);
    //         if (!this.multiple()) {
    //           this.popClose();
    //         }
    //       };
    //       // });
    //     });
    //   },
    //   { allowSignalWrites: true }
    // );

    // effect(() => this.setValue(this.value()), { allowSignalWrites: true });
  }

  // open() {
  //   const target = this.el.nativeElement;
  //   const { diaRef } = this.popover.open(
  //     this.optionsTemplate()!,
  //     { target, position: 'bl' },
  //     { width: this.size() === 'target' ? 'target' : '', maxHeight: '400px' }
  //   );
  //   diaRef.events.subscribe(() => {
  //     this.events.next('open');
  //   });
  //   this.popClose = () => {
  //     diaRef.close();
  //     this.events.next('close');
  //   };
  // }

  // setValue(values: string[], skip = false): void {
  //   let localValue = this.localValue();
  //   let setValue: any;
  //   if (this.multiple()) {
  //     values.forEach(v => {
  //       const index = localValue.indexOf(v);
  //       if (index > -1) {
  //         localValue = localValue.filter((_, i) => i !== index);
  //       } else {
  //         localValue = [...localValue, v];
  //       }
  //     });
  //     setValue = localValue;
  //   } else {
  //     localValue = values;
  //     setValue = values[0];
  //   }
  //   this.localValue.set(localValue);
  //   if (!skip) {
  //     this.onChange(setValue);
  //     this.onTouched();
  //     this.valueChange.emit(setValue);
  //   }
  // }

  // writeValue(value: string | string[]): void {
  //   value = Array.isArray(value) ? value : [value];
  //   this.localValue.set(value);
  // }

  // registerOnChange(fn: (value: string) => void): void {
  //   this.onChange = fn;
  // }

  // registerOnTouched(fn: VoidFunction): void {
  //   this.onTouched = fn;
  // }
}
