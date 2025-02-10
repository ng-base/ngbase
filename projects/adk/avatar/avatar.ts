import {
  computed,
  contentChildren,
  Directive,
  effect,
  ElementRef,
  input,
  Type,
} from '@angular/core';

@Directive({
  selector: '[meeAvatarGroup]',
})
export class MeeAvatarGroup {
  readonly avatars = contentChildren<MeeAvatar, ElementRef<HTMLElement>>(MeeAvatar, {
    read: ElementRef,
  });
  readonly reverse = input<boolean>(false);
  readonly left = input<number>(-8);

  constructor() {
    effect(() => {
      const avatars = this.avatars();

      let i = this.reverse() ? 0 : avatars.length - 1;
      let left = 0;
      avatars.forEach(avatar => {
        avatar.nativeElement.style.zIndex = `${this.reverse() ? i++ : i--}`;
        avatar.nativeElement.style.marginInlineStart = `${left}px`;
        left = this.left();
      });
    });
  }
}

@Directive({
  selector: '[meeAvatar]',
})
export class MeeAvatar {
  readonly src = input<string>();
  readonly name = input<string>();
  readonly text = input<string>();

  readonly nameChar = computed(() => {
    if (this.src()) return '';
    // if text is present, return it
    if (this.text()) return this.text();

    const name = this.name() || '';
    // split the name into words and get the first character of each word
    return name
      .split(' ')
      .slice(0, 2)
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  });
}

export function provideAvatar(avatar: Type<MeeAvatar>) {
  return { provide: MeeAvatar, useExisting: avatar };
}
