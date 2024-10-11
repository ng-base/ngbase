import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'mee-avatar, [meeAvatar]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (src()) {
      <img [src]="src()" alt="avatar" class="h-full max-h-full max-w-full" />
    } @else {
      <ng-content>{{ nameChar() }}</ng-content>
    }
  `,
  host: {
    class: 'inline-flex aspect-square rounded-full overflow-hidden border-2 border-foreground',
    '[class]': `!src() && nameChar() ? 'bg-background text-muted items-center justify-center' : ''`,
  },
})
export class Avatar {
  readonly src = input<string>();
  readonly name = input<string>();
  readonly text = input<string>();

  readonly nameChar = computed(() => {
    // if text is present, return it
    if (this.text()) return this.text();

    const name = this.name() || '';
    // split the name into words and get the first character of each word
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('');
  });
}
