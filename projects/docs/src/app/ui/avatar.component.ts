import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { Avatar, AvatarGroup } from '@meeui/avatar';
import { DocCode } from './code.component';

@Component({
  standalone: true,
  selector: 'app-avatar',
  imports: [Heading, Avatar, DocCode, AvatarGroup],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-b5" id="avatarPage">Avatar</h4>
    <app-doc-code [htmlCode]="htmlCode" [tsCode]="tsCode">
      <div class="flex items-center gap-b2">
        <mee-avatar class="w-9" name="Sheik Althaf"></mee-avatar>
        <mee-avatar
          class="shadow-outline-red w-9"
          src="https://avatars.dicebear.com/api/avataaars/1.svg"
        ></mee-avatar>

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
          <mee-avatar class="h-full w-7 border-red-200 text-[10px]" text="+2"></mee-avatar>
        </mee-avatar-group>
      </div>
    </app-doc-code>
  `,
})
export class AvatarComponent {
  otp = '';
  htmlCode = `
      <mee-avatar
        class="w-b12"
        src="...your image url..."
      />
    `;

  tsCode = `
  import { Component } from '@angular/core';
  import { Avatar } from '@meeui/avatar';

  @Component({
    standalone: true,
    selector: 'app-root',
    template: \`${this.htmlCode}\`,
    imports: [Avatar],
  })
  export class AppComponent { }
  `;
}
