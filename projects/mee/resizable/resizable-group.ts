import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MeeResizableGroup } from '@meeui/adk/resizable';

@Component({
  selector: 'mee-resizable-group',
  exportAs: 'meeResizableGroup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: MeeResizableGroup, useExisting: ResizableGroup }],
  template: `<ng-content select="mee-resizable" />`,
  host: {
    class: 'flex w-full',
    '[class.flex-col]': "direction() === 'vertical'",
    '[attr.id]': 'id',
  },
})
export class ResizableGroup extends MeeResizableGroup {}
