import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  TemplateRef,
  contentChildren,
  effect,
  forwardRef,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectOption } from './select-option.component';
import { NgTemplateOutlet } from '@angular/common';
import { popoverPortal } from '@meeui/popover';
import { Subject } from 'rxjs';

@Component({
  selector: 'mee-select',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `
    <div
      #inputContainer
      class="block w-full rounded-md border border-gray-300 px-3 py-2"
      (click)="open()"
    >
      {{ value }}
    </div>
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
  value = '';
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
          this.popClose();
        };
      });
    });
  }

  open() {
    const el = this.inputContainer()!.nativeElement;
    const { diaRef } = this.popover.open(
      this.optionsTemplate()!,
      el,
      { width: 'target', maxHeight: '400px' },
      'bottom',
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

  setValue(value: string): void {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  writeValue(value: string): void {
    this.setValue(value);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
