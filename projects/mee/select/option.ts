import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  booleanAttribute,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { AccessibleItem } from '@meeui/adk/a11y';
import { Checkbox } from '@meeui/ui/checkbox';
import { ListStyle } from '@meeui/ui/list';

@Component({
  selector: 'mee-option, [meeOption]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Checkbox],
  template: ` @if (multiple()) {
      <mee-checkbox [checked]="checked()" class="!py-0" />
    }
    <ng-content />`,
  host: {
    role: 'option',
    '(click)': 'selectOption()',
    '[class.bg-muted-background]': 'active() || checked()',
    tabindex: '-1',
  },
  hostDirectives: [
    ListStyle,
    {
      directive: AccessibleItem,
      inputs: ['role', 'disabled', 'ayId'],
      outputs: ['selectedChange'],
    },
  ],
})
export class Option<T> {
  readonly allyItem = inject(AccessibleItem);
  value = input<T>();
  readonly multiple = model(false);
  checked = signal(false);
  active = signal(false);
  disabled = input(false, { transform: booleanAttribute });
  onSelectionChange = output<T>();
  el = inject<ElementRef<HTMLElement>>(ElementRef);
  ayId = '';

  selectOption() {}

  setAyId(id: string) {
    this.ayId = id;
    this.allyItem.ayId.set(id);
  }

  label() {
    return this.el.nativeElement.textContent || '';
  }

  focus() {
    this.el.nativeElement.scrollIntoView({ block: 'nearest' });
    this.el.nativeElement.classList.add('bg-muted-background');
  }

  unselect() {
    this.el.nativeElement.classList.remove('bg-muted-background');
  }

  getValue() {
    return this.value() || this.label();
  }
}
