import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RangePipe } from '@ngbase/adk/utils';
import { Card } from '@meeui/ui/card';
import { Separator } from '@meeui/ui/separator';
import { Heading } from '@meeui/ui/typography';

@Component({
  selector: 'app-typography',
  imports: [Heading, Separator, Card, RangePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader="sm">Heading 1</h4>
    <mee-separator class="my-2" />
    <p class="text-muted-foreground text-base">
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Perferendis maiores in aspernatur
      rerum, eligendi, pariatur ipsum eaque non, similique veritatis delectus earum magni nemo sunt
      odio officiis tenetur. Obcaecati excepturi minus quas optio eaque facere soluta odit nostrum
      distinctio dignissimos, laboriosam consectetur veritatis vero maiores repudiandae expedita
      quod numquam temporibus!
    </p>

    <h4 meeHeader="lg" class="mt-4">Heading lg</h4>
    <h4 meeHeader="md">Heading md</h4>
    <h4 meeHeader="sm">Heading sm</h4>
    <h4 meeHeader="xs">Heading xs</h4>
    <h4 meeHeader>Heading</h4>

    <div class="mt-4 flex flex-col gap-4">
      @for (i of 2 | range; track i) {
        <mee-card>
          <h4 meeHeader>Heading 2</h4>
          <p class="text-muted-foreground">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Perferendis maiores in
            aspernatur rerum, eligendi
          </p>
        </mee-card>
      }
    </div>
  `,
})
export default class TypographyComponent {
  checkBox = false;
}
