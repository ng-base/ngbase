import {
  Directive,
  ElementRef,
  inject,
  input,
  linkedSignal,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { InputBase } from '@meeui/adk/form-field';
import { disposals, documentListener, provideValueAccessor } from '@meeui/adk/utils';

@Directive({
  selector: 'input[meeInlineInput]',
  hostDirectives: [InputBase],
  host: {
    '(blur)': 'ie.onBlur()',
    '(keydown.enter)': 'ie.onEnter($event)',
    '(keydown.escape)': 'ie.onEnter($event)',
    '[style.width.px]': 'ie.inputWidth()',
  },
})
export class MeeInlineInput {
  readonly ie = inject(MeeInlineEdit);
  readonly inputBase = inject(InputBase);

  constructor() {
    this.inputBase.value.set(this.ie.localValue());
    this.inputBase.value.subscribe(v => {
      this.ie.updateValue(v);
    });
  }
}

@Directive({
  selector: '[meeInlineValue]',
  host: {
    '(click)': 'ie.onClick()',
    '(dblclick)': 'ie.onDoubleClick()',
  },
})
export class MeeInlineValue {
  readonly ie = inject(MeeInlineEdit);
}

@Directive({
  selector: '[meeInlineEdit]',
  providers: [provideInlineEdit()],
})
export class MeeInlineEdit implements ControlValueAccessor {
  // Dependencies
  private readonly el = inject(ElementRef);
  private readonly disposals = disposals();
  readonly inputElement = viewChild<MeeInlineInput, ElementRef>(MeeInlineInput, {
    read: ElementRef,
  });

  // Inputs
  readonly value = input('');
  readonly editOn = input<'click' | 'dblclick'>('dblclick');
  readonly valueChange = output<string>();

  // State
  readonly localValue = linkedSignal(this.value);
  readonly isEditing = signal(false);
  readonly inputWidth = signal(0);
  onChange?: (value: string) => void;
  onTouched?: () => void;

  constructor() {
    documentListener('click', (ev: Event) => {
      if (this.isEditing() && !this.el.nativeElement.contains(ev.target)) {
        this.onBlur();
      }
    });
  }

  onClick() {
    if (this.editOn() === 'click') {
      this.startEditing();
    }
  }

  onDoubleClick() {
    if (this.editOn() === 'dblclick') {
      this.startEditing();
    }
  }

  startEditing() {
    this.isEditing.set(true);
    this.inputWidth.set(this.el.nativeElement.offsetWidth);
    this.disposals.afterNextRender(() => this.inputElement()?.nativeElement.focus());
  }

  onBlur() {
    this.isEditing.set(false);
  }

  onEnter(ev: Event) {
    ev.stopPropagation();
    this.onBlur();
  }

  updateValue(newValue: string) {
    this.localValue.set(newValue);
    this.valueChange.emit(newValue);
    this.onChange?.(newValue);
    this.onTouched?.();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: string): void {
    this.localValue.set(value);
  }
}

export function provideInlineEdit() {
  return provideValueAccessor(MeeInlineEdit);
}
