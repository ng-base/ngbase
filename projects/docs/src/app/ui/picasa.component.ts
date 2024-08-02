import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Picasa, PicasaItem } from '@meeui/picasa';
import { Heading } from '@meeui/typography';
import { RangePipe } from '@meeui/utils';

@Component({
  standalone: true,
  selector: 'app-picasa',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Picasa, PicasaItem, Heading, RangePipe],
  template: `
    <h4 meeHeader class="mb-5">Picasa</h4>
    <div meePicasa class="grid grid-cols-5">
      @for (item of 5 | range; track $index) {
        <img meePicasaItem src="/wallpaper.jpg" alt="Placeholder" width="100" />
      }
      <img meePicasaItem src="/logo.png" alt="Placeholder" />
    </div>
  `,
})
export class PicasaComponent {}
