import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'mee-avatar',
  standalone: true,
  template: `
    @if (src()) {
      <img
        [src]="src()"
        alt="avatar"
        class="aspect-sqaure h-full max-h-full w-full max-w-full rounded-full"
      />
    } @else {
      <div
        class="flex h-full w-full items-center justify-center rounded-full bg-background p-2"
      >
        {{ nameChar() }}
      </div>
    }
  `,
  host: {
    class: 'inline-block aspect-sqaure',
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
      .map((word) => word.charAt(0))
      .join('');
  });
}
