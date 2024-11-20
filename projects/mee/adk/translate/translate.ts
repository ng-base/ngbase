import {
  inject,
  Injector,
  linkedSignal,
  Pipe,
  PipeTransform,
  signal,
  untracked,
} from '@angular/core';
import { injectTranslate } from './translate.service';

@Pipe({
  name: 'translate',
})
export class Translate implements PipeTransform {
  private translate = injectTranslate();
  private value = signal<[string, ...any[]]>(['']);
  private linkedValue = linkedSignal({
    source: () => ({ value: this.value(), data: this.translate.translations() }),
    computation: ({ value }) => {
      return this.translate.translate(value[0], value[1]);
    },
  });

  transform(value: string, ...args: any[]) {
    // untracked to avoid error: cannot set signal inside computation
    untracked(() => {
      this.value.set([value, ...args]);
    });
    return this.linkedValue;
  }
}

export function translate() {
  const ts = injectTranslate();
  const injector = inject(Injector);
  return (value: string, ...args: any[]) => {
    console.count(value);
    return ts.translate(value, args[0]);
  };
}
