import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  TemplateRef,
  contentChildren,
  output,
  viewChild,
} from '@angular/core';
import { DialogRef } from '../portal';
import { Keys } from '../keys';
import { Option } from '../select';
import { List } from '../list';
import { AccessibleGroup } from '../a11y';

@Component({
  selector: 'mee-menu',
  standalone: true,
  exportAs: 'meeMenu',
  imports: [AccessibleGroup],
  template: `
    <ng-template #container>
      <div
        (click)="close()"
        class="flex flex-col"
        meeAccessibleGroup
        [ayId]="this.diaRef.options.ayId"
        [isPopup]="true"
      >
        <ng-content></ng-content>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Menu implements OnDestroy {
  readonly container = viewChild.required('container', { read: TemplateRef });
  readonly options = contentChildren(Option);
  readonly lists = contentChildren(List);
  readonly manager = new Keys();
  readonly selected = output<string>();
  // this will be injected by the MenuTrigger directive
  diaRef!: DialogRef;

  opened() {
    this.options().forEach((list, i) => {
      list.setAyId(this.diaRef.options.ayId!);
    });
    this.lists().forEach((list, i) => {
      list.setAyId(this.diaRef.options.ayId!);
    });
  }

  close = () => {
    this.diaRef?.close();
  };

  ngOnDestroy() {
    this.close();
  }
}
