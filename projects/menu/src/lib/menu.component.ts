import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'mee-menu',
  standalone: true,
  imports: [],
  template: `
    <ng-template #container>
      <ng-content></ng-content>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Menu {
  container = viewChild('container', { read: TemplateRef });
}
