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
    effect(() => {
      const avatars = this.avatars();

      let i = 0;
      avatars.forEach(avatar => {
        avatar.nativeElement.style.zIndex = i++;
      });
    });
  }
}
