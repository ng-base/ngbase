import { computed, Directive, inject, input } from '@angular/core';

@Directive({
  selector: '[meeProgressBar]',
  host: {
    '[style.transform]': `'translateX(-' + progress.total() + '%)'`,
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

  readonly total = computed(() => {
    let percentage = this.value();
    percentage = percentage > 100 ? 100 : percentage < 0 ? 0 : percentage;
    return 100 - percentage;
  });
}
