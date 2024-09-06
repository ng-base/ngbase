import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { Avatar } from '@meeui/avatar';
import { DocCode } from './code.component';

@Component({
  standalone: true,
  selector: 'app-avatar',
  imports: [Heading, Avatar, DocCode],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-b5" id="avatarPage">Avatar</h4>
    <app-doc-code [htmlCode]="htmlCode" [tsCode]="tsCode">
      <mee-avatar class="w-b12" name="Sheik Althaf"></mee-avatar>
      <mee-avatar class="w-b12" src="https://avatars.dicebear.com/api/avataaars/1.svg"></mee-avatar>
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
