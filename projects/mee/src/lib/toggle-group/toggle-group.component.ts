import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  effect,
  forwardRef,
  input,
} from '@angular/core';
import { ToggleItem } from './toggle-item.component';
import { Subscription } from 'rxjs';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'mee-toggle-group',
  standalone: true,
  imports: [],
  template: ` <ng-content select="[meeToggleItem]"></ng-content> `,
  host: {
    class: 'flex gap-1',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleGroup),
      multi: true,
    },
  ],
})
export class ToggleGroup implements ControlValueAccessor {
  multiple = input(true);
  toggleItems = contentChildren(ToggleItem);
  subscriptions = new Subscription();
  value: any[] = [];
  onChange = (value: any) => {};
  onTouched = () => {};

  constructor() {
    effect(
      () => {
        const toggleItems = this.toggleItems();
        this.subscriptions.unsubscribe();
        this.subscriptions = new Subscription();
        toggleItems.forEach((toggleItem) => {
          toggleItem.active.set(this.value.includes(toggleItem.value()));
          this.subscriptions.add(
            toggleItem.activeChange.subscribe((active) => {
              this.toggleValue(toggleItem.value());
              if (!this.multiple() && active) {
                toggleItems.forEach((item) => {
                  if (item !== toggleItem) {
                    item.active.set(false);
                  }
                });
              }
            }),
          );
        });
      },
      { allowSignalWrites: true },
    );
  }

  toggleValue(value: any) {
    // remove the value if it's already selected
    if (this.value.includes(value)) {
      this.value = this.value.filter((v) => v !== value);
    } else {
      // add the value if it's not selected
      this.value = this.multiple() ? [...this.value, value] : [value];
    }
    this.onChange(this.value);
    this.onTouched();
  }

  writeValue(value: any): void {
    this.value = value || [];
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
