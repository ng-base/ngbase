import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icon } from '@meeui/ui/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideGripVertical } from '@ng-icons/lucide';
import {
  NgbGutter,
  NgbResizable,
  NgbResizableGroup,
  aliasResizable,
  aliasResizableGroup,
} from '@ngbase/adk/resizable';

@Component({
  selector: 'mee-resizable-group',
  exportAs: 'meeResizableGroup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [aliasResizableGroup(ResizableGroup)],
  template: `<ng-content select="mee-resizable" />`,
  host: {
    class: 'flex w-full',
    '[class.flex-col]': "direction() === 'vertical'",
    '[attr.id]': 'id',
  },
})
export class ResizableGroup extends NgbResizableGroup {}

@Component({
  selector: 'mee-resizable',
  exportAs: 'meeResizable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [aliasResizable(Resizable)],
  viewProviders: [provideIcons({ lucideGripVertical })],
  imports: [Icon, NgbGutter],
  template: `<ng-content />
    <ng-template #dragElement>
      @if (draggable()) {
        <div
          ngbGutter
          class="{{
            'dragElement relative flex cursor-ew-resize items-center justify-center after:absolute after:top-0' +
              (resizable.direction() === 'vertical'
                ? ' bottom-0 left-0 h-0 w-full cursor-ns-resize border-b after:-mt-1 after:h-2 after:w-full'
                : ' right-0 top-0 w-0 cursor-ew-resize border-l after:h-full after:w-2')
          }}"
        >
          <mee-icon
            name="lucideGripVertical"
            class="z-30 rounded-lg border bg-muted-background py-0.5"
            size=".75rem"
            [class]="resizable.direction() === 'vertical' ? 'rotate-90' : ''"
          />
        </div>
      }
    </ng-template>`,
  host: {
    class: 'relative overflow-hidden block flex-none',
  },
})
export class Resizable extends NgbResizable {}
