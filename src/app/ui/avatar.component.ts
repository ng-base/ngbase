import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { Avatar } from '@meeui/avatar';

@Component({
  standalone: true,
  selector: 'app-avatar',
  imports: [Heading, Avatar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="avatarPage">Avatar</h4>
    <mee-avatar
      class="w-12"
      src="https://avatars.dicebear.com/api/avataaars/1.svg"
    ></mee-avatar>
  `,
})
export class AvatarComponent {
  otp = '';
}
