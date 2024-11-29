import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MeeResizable, MeeGutter } from '@meeui/adk/resizable';
import { Icon } from '@meeui/ui/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideGripVertical } from '@ng-icons/lucide';

@Component({
  selector: 'mee-resizable',
  exportAs: 'meeResizable',
  imports: [Icon, NgClass, MeeGutter],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: MeeResizable, useExisting: Resizable }],
  viewProviders: [provideIcons({ lucideGripVertical })],
  template: `<ng-content />
    <ng-template #dragElement>
      @if (draggable()) {
        <div
          meeGutter
          class="dragElement relative flex cursor-ew-resize items-center justify-center after:absolute after:top-0"
          [ngClass]="
            resizable.direction() === 'vertical'
              ? 'bottom-0 left-0 h-0 w-full cursor-ns-resize border-b after:-mt-b after:h-b2 after:w-full'
              : 'right-0 top-0 w-0 cursor-ew-resize border-l after:h-full after:w-b2'
          "
        >
          <mee-icon
            name="lucideGripVertical"
            class="z-30 rounded-base border bg-muted-background py-0.5"
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
export class Resizable extends MeeResizable {}
