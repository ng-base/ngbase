import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'mee-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div
    class="h-full bg-primary transition"
    [style.transform]="'translateX(-' + total() + '%)'"
  ></div>`,
  host: {
    class: 'block h-b2 my-1 bg-muted-background rounded-full overflow-hidden',
    role: 'progressbar',
    '[attr.aria-valuenow]': 'value()',
    '[attr.aria-valuemin]': '0',
    '[attr.aria-valuemax]': '100',
  },
})
export class Progress {
  readonly value = input(0);

  readonly total = computed(() => {
    let percentage = this.value();
    percentage = percentage > 100 ? 100 : percentage < 0 ? 0 : percentage;
    return 100 - percentage;
  });
}
