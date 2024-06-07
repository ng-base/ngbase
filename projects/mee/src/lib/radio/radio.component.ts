import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { generateId } from '../utils';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'mee-radio',
  standalone: true,
  imports: [FormsModule, NgIf, NgClass],
  template: `
    <!-- <input
      type="radio"
      [checked]="checked()"
      (change)="updateValue($event)"
      [id]="inputId"
      [name]="name"
      [value]="value()"
      class="h-5 w-5"
    />
    <label [for]="inputId">
      <ng-content></ng-content>
    </label> -->
    <div
      class="flex cursor-pointer items-center gap-b2"
      (click)="updateValue($event)"
    >
      <button
        type="radio"
        class="custom-radio h-b4 w-b4 relative flex items-center justify-center rounded-full border border-black"
      >
        <div *ngIf="checked()" class="h-b2 w-b2 rounded-full bg-black"></div>
      </button>
      <ng-content></ng-content>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex items-center gap-2 py-1',
  },
})
export class Radio {
  value = input<any>();
  radioValue = signal<any>('');
  inputId = generateId();
  checked = computed(() => this.value() === this.radioValue());
  name = '';

  updateValue(value: any) {}

  setValue(value: any) {
    if (this.value() === value) {
      this.radioValue.set(this.value());
    }
  }
}
