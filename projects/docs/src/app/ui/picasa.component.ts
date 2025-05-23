import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RangePipe } from '@ngbase/adk/utils';
import { Picasa, PicasaItem } from '@meeui/ui/picasa';
import { Heading } from '@meeui/ui/typography';

@Component({
  selector: 'app-picasa',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Picasa, PicasaItem, Heading, RangePipe],
  template: `
    <h4 meeHeader class="mb-5">Picasa</h4>
    <div meePicasa class="grid grid-cols-3 gap-4">
      @for (item of 5 | range; track $index) {
        <img meePicasaItem src="/wallpaper.jpg" alt="Placeholder" />
      }
    </div>
  `,
})
export default class PicasaComponent {}
