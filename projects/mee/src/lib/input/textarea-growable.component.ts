import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, ViewChild, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputStyle } from './input-style.directive';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputStyle],
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'textarea-growable',
  template: ` <textarea
    #inputTextarea
    meeInputStyle
    name="text"
    autocomplete="off"
    [attr.placeholder]="placeholder"
    id="messageText"
    onInput="this.parentNode.dataset.replicatedValue = this.value"
    [formControl]="form"
    (blur)="onTouch()"
    [disabled]="disabled"
  ></textarea>`,
  host: {
    class: 'overflow-auto',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaGrowableComponent),
      multi: true,
    },
  ],
})
export class TextareaGrowableComponent implements ControlValueAccessor, AfterViewInit {
  @ViewChild('inputTextarea') inputTextarea!: ElementRef<HTMLTextAreaElement>;
  @Input() placeholder = 'Enter your input here';
  readonly form = new FormControl<string>('');
  disabled = false;
  onChange: any = () => {};
  onTouch: any = () => {};

  constructor() {
    this.form.valueChanges.subscribe(v => {
      this.onChangeValue();
    });
  }

  ngAfterViewInit() {
    this.updateReplicateValue();
  }

  addPlaceholderToPromptElement(placeholder: string) {
    const input = this.inputTextarea.nativeElement;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const value = input.value;
    const before = value.substring(0, start);
    const after = value.substring(end, value.length);
    input.value = before + placeholder + after;
    input.selectionStart = input.selectionEnd = start + placeholder.length;
    input.focus();
    this.form.patchValue(input.value);
    // move cursor to end of placeholder
    // this.updateReplicateValue();
    input.setSelectionRange(start + placeholder.length, start + placeholder.length);
  }

  private updateReplicateValue() {
    if (this.inputTextarea) {
      const el = this.inputTextarea.nativeElement;
      (el.parentNode as any).dataset.replicatedValue = this.form.value;
      this.inputTextarea.nativeElement.focus();
    }
  }

  onChangeValue() {
    this.onChange(this.form.value);
    this.updateReplicateValue();
  }

  writeValue(value: any): void {
    this.form.setValue(value);
    // this.updateReplicateValue();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
