import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
} from '@angular/core';
import { keyMap } from './shortcuts.service';

@Component({
  selector: 'mee-key, [meeKey]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ content() }}`,
  host: {
    class: 'ml-auto text-xs tracking-widest opacity-60 text-muted',
  },
})
export class Key {
  readonly el = inject<ElementRef<HTMLButtonElement>>(ElementRef);

  readonly meeKey = input.required<string>();
  readonly content = computed(() => {
    return this.meeKey().replace(/\+/g, ' ');
  });

  constructor() {
    const injector = inject(Injector);
    effect(cleanup => {
      keyMap(this.meeKey(), () => this.el.nativeElement.click(), { cleanup, injector });
    });
  }
}
