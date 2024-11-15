import {
  Component,
  ElementRef,
  inject,
  input,
  linkedSignal,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, FormsModule } from '@angular/forms';
import { disposals, documentListener, provideValueAccessor } from '@meeui/ui/utils';

@Component({
  selector: 'mee-inline-edit',
  imports: [FormsModule],
  providers: [provideValueAccessor(InlineEdit)],
  template: `
    @if (isEditing()) {
      <input
        #inputElement
        [ngModel]="localValue()"
        (ngModelChange)="updateValue($event)"
        (blur)="onBlur()"
        (keydown.enter)="onEnter($event)"
        (keydown.escape)="onEnter($event)"
        [style.width.px]="inputWidth()"
        class="rounded p-1 drop-shadow-md focus:border-transparent focus:outline-none"
      />
    } @else {
      <div (click)="onClick()" (dblclick)="onDoubleClick()" class="cursor-pointer p-1">
        {{ localValue() }}
      </div>
    }
  `,
})
export class InlineEdit implements ControlValueAccessor {
  // Dependencies
  private readonly el = inject(ElementRef);
  private readonly disposals = disposals();
  readonly inputElement = viewChild<ElementRef>('inputElement');

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
    this.valueChange.emit(newValue);
    this.localValue.set(newValue);
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
