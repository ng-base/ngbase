import { computed, Directive, inject, input } from '@angular/core';
import { injectDirectionality } from '@meeui/adk/bidi';

@Directive({
  selector: '[meeProgressBar]',
  host: {
    '[style.transform]': `'translateX(' + progress.total() + '%)'`,
  },
})
export class MeeProgressBar {
  readonly progress = inject(MeeProgress);
}

@Directive({
  selector: '[meeProgress]',
  exportAs: 'meeProgress',
  host: {
    style: `overflow: hidden`,
    role: 'progressbar',
    '[attr.aria-valuenow]': 'value()',
    '[attr.aria-valuemin]': '0',
    '[attr.aria-valuemax]': '100',
  },
})
export class MeeProgress {
  readonly value = input(0);
  readonly dir = injectDirectionality();

  readonly total = computed(() => {
    const percentage = Math.min(100, Math.max(0, this.value()));
    return this.dir.isRtl() ? 100 - percentage : percentage - 100;
  });
}
