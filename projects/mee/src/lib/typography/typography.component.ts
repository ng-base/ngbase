import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mee-typography',
  standalone: true,
  imports: [],
  template: `
    <p>
      typography works!
    </p>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypographyComponent {

}
