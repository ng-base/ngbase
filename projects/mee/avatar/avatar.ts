import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  ElementRef,
  input,
} from '@angular/core';

@Component({
  selector: 'mee-avatar-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // imports: [Avatar],
  template: `
    <ng-content select="mee-avatar,[meeAvatar]" />
    <!-- <mee-avatar text="+2" class="h-full w-7" /> -->
    <!-- <mee-avatar class="h-full w-7 text-[10px]" name="Sheik Althaf" /> -->
  `,
  host: {
    class: 'flex flex-row -space-x-4 hover:space-x-0',
    style: `transition: all 0.3s ease`,
  },
})
export class AvatarGroup {
  readonly length = input<number>();
  readonly avatars = contentChildren(Avatar, { descendants: true, read: ElementRef });

  constructor() {
    afterRenderEffect(() => {
      const avatars = this.avatars();

      let i = 0;
      avatars.forEach(avatar => {
        avatar.nativeElement.style.zIndex = i++;
      });
    });
  }
}

@Component({
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
