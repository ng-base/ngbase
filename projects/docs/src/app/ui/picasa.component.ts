import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Picasa, PicasaItem } from '@meeui/ui/picasa';
import { Heading } from '@meeui/ui/typography';
import { RangePipe } from '@meeui/ui/utils';

@Component({
  selector: 'app-picasa',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Picasa, PicasaItem, Heading, RangePipe],
  template: `
    <h4 meeHeader class="mb-5">Picasa</h4>
    <div meePicasa class="grid grid-cols-3 gap-b4">
      @for (item of 5 | range; track $index) {
        <img meePicasaItem src="/wallpaper.jpg" alt="Placeholder" />
      }
    </div>
  `,
})
export class PicasaComponent {}
