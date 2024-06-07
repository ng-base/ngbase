import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

@Component({
  selector: 'mee-progress',
  standalone: true,
  template: `<div
    class="h-full bg-primary transition"
    [style.transform]="'translateX(-' + total() + '%)'"
  ></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block h-b2 my-1 bg-muted-background rounded-full overflow-hidden',
    role: 'progressbar',
  },
})
export class Progress {
  percentage = input(0);

  total = computed(() => {
    let percentage = this.percentage();
    percentage = percentage > 100 ? 100 : percentage < 0 ? 0 : percentage;
    return 100 - percentage;
  });
}
