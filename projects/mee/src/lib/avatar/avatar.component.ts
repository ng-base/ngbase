import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'mee-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (src()) {
      <img
        [src]="src()"
        alt="avatar"
        class="aspect-sqaure h-full max-h-full max-w-full rounded-full"
      />
    } @else if (name()) {
      <div
        class="aspect-sqaure flex h-full max-h-full max-w-full items-center justify-center rounded-full bg-background p-b2"
      >
        {{ nameChar() }}
      </div>
    } @else {
      <ng-content />
    }
  `,
  host: {
    class: 'inline-flex aspect-sqaure rounded-base',
  },
})
export class Avatar {
  src = input<string>();
  name = input<string>();

  nameChar = computed(() => {
    const name = this.name() || '';
    // split the name into words and get the first character of each word
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('');
  });
}
