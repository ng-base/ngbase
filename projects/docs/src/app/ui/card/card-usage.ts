import { Component } from '@angular/core';
import { Card } from '@meeui/ui/card';
import { Avatar } from '@meeui/ui/avatar';

@Component({
  selector: 'app-root',
  imports: [Card, Avatar],
  template: `
    <mee-card>
      <div class="flex flex-col gap-2">
        <mee-avatar
          src="https://pbs.twimg.com/profile_images/1238875353457635328/VKdeKwcq_200x200.jpg"
          alt="Mee UI"
          class="w-12"
        />
        <div class="flex flex-col gap-4">
          <div>
            <div class="Text font-bold">Mee</div>
            <div class="text-muted">&#64;mee_ui</div>
          </div>
          <div class="Text">
            Components, icons, colors, and templates for building high-quality, accessible UI. Free
            and open-source.
          </div>
          <div class="flex gap-4">
            <div class="flex gap-1">
              <div class="Text font-bold">0</div>
              <div class="text-muted">Following</div>
            </div>
            <div class="flex gap-1">
              <div class="Text font-bold">2,900</div>
              <div class="text-muted">Followers</div>
            </div>
          </div>
        </div>
      </div>
    </mee-card>
  `,
})
export class AppComponent {}
