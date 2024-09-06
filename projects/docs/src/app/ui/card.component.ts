import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Avatar } from '@meeui/avatar';
import { Card } from '@meeui/card';
import { Heading } from '@meeui/typography';
import { RangePipe } from '@meeui/utils';

@Component({
  standalone: true,
  selector: 'app-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, Heading, RangePipe, Avatar],
  template: `
    <h4 meeHeader class="mb-5" id="colorPickerPage">Card</h4>

    <div class="grid grid-cols-4 gap-b4">
      @for (i of 3 | range; track $index) {
        <mee-card>
          <div class="flex flex-col gap-b2">
            <mee-avatar
              src="https://pbs.twimg.com/profile_images/1337055608613253126/r_eiMp2H_400x400.png"
              alt="Radix UI"
              class="w-b12"
            />
            <div class="flex flex-col gap-b4">
              <div>
                <div class="Text font-bold">Radix</div>
                <div class="text-muted">&#64;radix_ui</div>
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
  `,
})
export class CardComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
