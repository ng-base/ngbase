import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Avatar } from '@meeui/ui/avatar';
import { Card } from '@meeui/ui/card';
import { Heading } from '@meeui/ui/typography';
import { RangePipe } from '@ngbase/adk/utils';
import { DocCode, getCode } from '../code.component';

@Component({
  selector: 'app-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, Heading, RangePipe, Avatar, DocCode],
  template: `
    <h4 meeHeader class="mb-5" id="colorPickerPage">Card</h4>

    <app-doc-code [tsCode]="tsCode()">
      <div class="grid grid-cols-4 gap-b4">
        @for (i of 3 | range; track $index) {
          <mee-card>
            <div class="flex flex-col gap-b2">
              <mee-avatar
                src="https://pbs.twimg.com/profile_images/1238875353457635328/VKdeKwcq_200x200.jpg"
                alt="Mee UI"
                class="w-b12"
              />
              <div class="flex flex-col gap-b4">
                <div>
                  <div class="Text font-bold">Mee</div>
                  <div class="text-muted">&#64;mee_ui</div>
                </div>
                <div class="Text">
                  Components, icons, colors, and templates for building high-quality, accessible UI.
                  Free and open-source.
                </div>
                <div class="flex gap-b4">
                  <div class="flex gap-b">
                    <div class="Text font-bold">0</div>
                    <div class="text-muted">Following</div>
                  </div>
                  <div class="flex gap-b">
                    <div class="Text font-bold">2,900</div>
                    <div class="text-muted">Followers</div>
                  </div>
                </div>
              </div>
            </div>
          </mee-card>
        }
      </div>
    </app-doc-code>
  `,
})
export default class CardComponent {
  tsCode = getCode('/card/card-usage.ts');
}
