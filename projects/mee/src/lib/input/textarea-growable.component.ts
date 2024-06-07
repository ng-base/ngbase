import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
  forwardRef,
} from '@angular/core';
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
  // styles: [
  //   `
  //     :host {
  //       /* easy way to plop the elements on top of each other and have them both sized based on the tallest one's height */
  //       display: grid;
  //       &::after {
  //         /* Note the weird space! Needed to preventy jumpy behavior */
  //         content: attr(data-replicated-value) ' ';

  //         /* This is how textarea text behaves */
  //         white-space: pre-wrap;

  //         /* Hidden from view, clicks, and screen readers */
  //         visibility: hidden;
  //       }
  //       & > textarea {
  //         /* You could leave this, but after a user resizes, then it ruins the auto sizing */
  //         resize: none;
  //         background: transparent;

  //         /* Firefox shows scrollbar on growth, you can hide like this. */
  //         overflow: hidden;
  //       }
  //       & > textarea,
  //       &::after {
  //         /* Identical styling required!! */
  //         // padding: 5rem;
  //         @apply px-3 py-b2;
  //         font: inherit;

  //         /* Place on top of each other */
  //         grid-area: 1 / 1 / 2 / 2;
  //       }
  //     }
  //   `,
  // ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaGrowableComponent),
      multi: true,
    },
  ],
})
export class TextareaGrowableComponent
  implements ControlValueAccessor, AfterViewInit
{
  @ViewChild('inputTextarea') inputTextarea!: ElementRef<HTMLTextAreaElement>;
  @Input() placeholder = 'Enter your input here';
  readonly form = new FormControl<string>('');
  disabled = false;
  onChange: any = () => {};
  onTouch: any = () => {};

  constructor() {
    this.form.valueChanges.subscribe((v) => {
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
    input.setSelectionRange(
      start + placeholder.length,
      start + placeholder.length,
    );
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
