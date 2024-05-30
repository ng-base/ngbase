import {
  Directive,
  afterNextRender,
  inject,
  input,
  output,
} from '@angular/core';
import { Keys } from '../keys';

@Directive({
  standalone: true,
  selector: '[meeShortcut]',
})
export class Shortcuts {
  keys = inject(Keys);
  meeShortcut = input.required<string>();
  onKeys = output<KeyboardEvent>();

  constructor() {
    afterNextRender(() => {
      const sub = this.keys.event(this.meeShortcut()).subscribe(([b, ev]) => {
        if (b) {
          // console.log('shortcut', this.meeShortcut());
          this.onKeys.emit(ev);
        }
      });

      return () => {
        console.log('unsubscribe');
        sub.unsubscribe();
      };
    });
  }
}
