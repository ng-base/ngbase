import { inject, Injector, linkedSignal, Pipe, PipeTransform, signal } from '@angular/core';
import { TranslateService } from './translate.service';

@Pipe({
  name: 'translate',
})
export class Translate implements PipeTransform {
  private translate = inject(TranslateService);
  private value = signal<[string, ...any[]]>(['']);
  private linkedValue = linkedSignal({
    source: () => ({ value: this.value(), data: this.translate.translations() }),
    computation: ({ value }) => {
      return this.translate.translate(value[0], value[1]);
    },
  });

  transform(value: string, ...args: any[]) {
    Promise.resolve().then(() => {
      this.value.set([value, ...args]);
    });
    return this.linkedValue;
    // return this.translate.translate(value, args[0]);
  }
}

export function translate() {
  const ts = inject(TranslateService);
  const injector = inject(Injector);
  return (value: string, ...args: any[]) => {
    console.count(value);
    return ts.translate(value, args[0]);
  };
}
