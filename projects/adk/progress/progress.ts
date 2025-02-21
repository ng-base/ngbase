import { computed, Directive, inject, input } from '@angular/core';
import { injectDirectionality } from '@ngbase/adk/bidi';

@Directive({
  selector: '[ngbProgressBar]',
  host: {
    '[style.transform]': `'translateX(' + progress.total() + '%)'`,
  },
})
export class NgbProgressBar {
  readonly progress = inject(NgbProgress);
}

@Directive({
  selector: '[ngbProgress]',
  exportAs: 'ngbProgress',
  host: {
    style: `overflow: hidden`,
    role: 'progressbar',
    '[attr.aria-valuenow]': 'value()',
    '[attr.aria-valuemin]': '0',
    '[attr.aria-valuemax]': '100',
  },
})
export class NgbProgress {
  readonly value = input(0);
  readonly dir = injectDirectionality();

  readonly total = computed(() => {
    const percentage = Math.min(100, Math.max(0, this.value()));
    return this.dir.isRtl() ? 100 - percentage : percentage - 100;
  });
}
