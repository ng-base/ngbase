import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Avatar, AvatarGroup } from '@meeui/ui/avatar';
import { Heading } from '@meeui/ui/typography';
import { DocCode, getCode } from '../code.component';

@Component({
  selector: 'app-avatar',
  imports: [Heading, Avatar, DocCode, AvatarGroup],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-b5" id="avatarPage">Avatar</h4>
    <app-doc-code [tsCode]="tsCode()" [adkCode]="adkCode()">
      <div class="flex items-center gap-b2">
        <mee-avatar class="w-9" name="Sheik Althaf" />
        <mee-avatar
          class="shadow-outline-red w-9"
          src="https://randomuser.me/api/portraits/women/0.jpg"
        />

        <mee-avatar-group>
          <button
            meeAvatar
            class="h-full w-9"
            src="https://randomuser.me/api/portraits/men/0.jpg"
          ></button>
          <button
            meeAvatar
            class="h-full w-9"
            src="https://randomuser.me/api/portraits/men/1.jpg"
          ></button>
          <button
            meeAvatar
            class="h-full w-9"
            src="https://randomuser.me/api/portraits/men/2.jpg"
          ></button>
          <mee-avatar class="h-full w-9 border-red-200 text-[10px]" text="+2" />
        </mee-avatar-group>
      </div>
    </app-doc-code>
  `,
})
export default class AvatarComponent {
  otp = '';
  tsCode = getCode('/avatar/avatar-usage.ts');

  adkCode = getCode('/avatar/avatar-adk.ts');
}
