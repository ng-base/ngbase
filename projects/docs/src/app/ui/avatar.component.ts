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
    <app-doc-code [tsCode]="tsCode" [adkCode]="adkCode">
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

  adkCode = `
  import { ChangeDetectionStrategy, Component } from '@angular/core';
  import { MeeAvatar, MeeAvatarGroup, provideAvatar } from '@meeui/adk/avatar';

  @Component({
    selector: 'mee-avatar-group',
    changeDetection: ChangeDetectionStrategy.OnPush,
    hostDirectives: [{ directive: MeeAvatarGroup, inputs: ['reverse', 'left'] }],
    template: \`<ng-content select="mee-avatar,[meeAvatar]" />\`,
    host: {
      class: 'flex flex-row',
    },
  })
  export class AvatarGroup {}

  @Component({
    selector: 'mee-avatar, [meeAvatar]',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideAvatar(Avatar)],
    template: \`
      @if (src(); as img) {
        <img [src]="img" alt="avatar" class="h-full max-h-full max-w-full" />
      } @else {
        <ng-content>{{ nameChar() }}</ng-content>
      }
    \`,
    host: {
      class:
        'inline-flex aspect-square rounded-full overflow-hidden border-2 border-foreground relative bg-background text-muted items-center justify-center',
    },
  })
  export class Avatar extends MeeAvatar {}
  `;
}
