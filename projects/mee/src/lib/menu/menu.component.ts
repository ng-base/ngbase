import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { DialogRef } from '../portal';

@Component({
  selector: 'mee-menu',
  standalone: true,
  imports: [],
  template: `
    <ng-template #container>
      <div (click)="close()">
        <ng-content></ng-content>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Menu {
  container = viewChild('container', { read: TemplateRef });
  // this will be injected by the MenuTrigger directive
  diaRef!: DialogRef;

  close() {
    this.diaRef.close();
  }
}
