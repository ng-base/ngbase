import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Avatar, AvatarGroup } from '@meeui/ui/avatar';
import { Heading } from '@meeui/ui/typography';
import { DocCode } from './code.component';

@Component({
  selector: 'app-avatar',
  imports: [Heading, Avatar, DocCode, AvatarGroup],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-b5" id="avatarPage">Avatar</h4>
    <app-doc-code [tsCode]="tsCode">
      <div class="flex items-center gap-b2">
        <mee-avatar class="w-9" name="Sheik Althaf" />
        <mee-avatar
          class="shadow-outline-red w-9"
          src="https://avatars.dicebear.com/api/avataaars/1.svg"
        />

        <mee-avatar-group>
          <button
            meeAvatar
            class="h-full w-7 border-red-200"
            src="https://avatars.dicebear.com/api/avataaars/1.svg"
          ></button>
          <button
            meeAvatar
            class="h-full w-7 border-red-200"
            src="https://avatars.dicebear.com/api/avataaars/1.svg"
          ></button>
          <button
            meeAvatar
            class="h-full w-7 border-red-200"
            src="https://avatars.dicebear.com/api/avataaars/1.svg"
          ></button>
          <mee-avatar class="h-full w-7 border-red-200 text-[10px]" text="+2" />
        </mee-avatar-group>
      </div>
    </app-doc-code>
  `,
})
export default class AvatarComponent {
  otp = '';
  tsCode = `
  import { Component } from '@angular/core';
  import { Avatar } from '@meeui/ui/avatar';

  @Component({
    selector: 'app-root',
    template: \`
      <mee-avatar
        class="w-b12"
        src="...your image url..."
      />
    \`,
    imports: [Avatar],
  })
  export class AppComponent { }
  `;
}
