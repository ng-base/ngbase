import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { generateId } from '../../../utils';

@Component({
  selector: 'mee-radio',
  standalone: true,
  imports: [FormsModule],
  template: `
    <input
      type="radio"
      [checked]="checked()"
      (change)="updateValue($event)"
      [id]="inputId"
      [name]="name"
      [value]="value()"
      class="h-5 w-5"
    />
    <label [for]="inputId" class="text-gray-700">
      <ng-content></ng-content>
    </label>
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
      console.log('setValue', this.radioValue());
    }
  }
}
