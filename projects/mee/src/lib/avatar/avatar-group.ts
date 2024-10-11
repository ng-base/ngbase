import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  effect,
  ElementRef,
  input,
} from '@angular/core';
import { Avatar } from './avatar';

@Component({
  standalone: true,
  selector: 'mee-avatar-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Avatar],
  template: `
    <ng-content select="mee-avatar,[meeAvatar]"></ng-content>
    <!-- <mee-avatar text="+2" class="h-full w-7" /> -->
    <!-- <mee-avatar class="h-full w-7 text-[10px]" name="Sheik Althaf"></mee-avatar> -->
  `,
  host: {
    class: 'flex flex-row -space-x-2 hover:space-x-0',
    style: `transition: all 0.3s ease`,
  },
})
export class AvatarGroup {
  readonly length = input<number>();
  readonly avatars = contentChildren(Avatar, { descendants: true, read: ElementRef });

  constructor() {
    effect(() => {
      const avatars = this.avatars();

      let i = avatars.length;
      avatars.forEach(avatar => {
        avatar.nativeElement.style.zIndex = i;
        i--;
      });
    });
  }
}
