import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  effect,
  inject,
  input,
  untracked,
} from '@angular/core';
import { Resizable } from './resizable.component';
import { ResizableService } from './resizable.service';

@Component({
  selector: 'mee-resizable-group',
  standalone: true,
  template: `<ng-content select="mee-resizable"></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ResizableService],
  host: {
    class: 'flex w-full',
    '[class.flex-col]': "direction() === 'vertical'",
  },
})
export class ResizableGroup {
  resizableService = inject(ResizableService);
  panels = contentChildren(Resizable);
  direction = input<'horizontal' | 'vertical'>('horizontal');

  constructor() {
    effect(
      () => {
        const panels = this.panels();
        const direction = this.direction();
        this.resizableService.direction.set(direction);

        panels.forEach((panel, index) => {
          panel.index = index;
          // hide the last panel's drag handle
          panel.draggable.set(true);
          if (index === panels.length - 1) {
            panel.draggable.set(false);
            return;
          }
        });
      },
      { allowSignalWrites: true },
    );

    // update the size
    // effect(
    //   () => {
    //     const panels = this.panels();
    //     const sizeUpdate = this.resizableService.updateSize();
    //     const direction = this.direction();

    //     if (sizeUpdate) {
    //       const first = panels[sizeUpdate.index];
    //       const second = panels[sizeUpdate.index + 1];
    //       const totalPercentage =
    //         untracked(first.size) + untracked(second.size);
    //       let total = 0;
    //       let newSize = 0;
    //       if (direction === 'horizontal') {
    //         total = first.width + second.width;
    //         newSize = first.width + sizeUpdate.event.xx;
    //       } else {
    //         total = first.height + second.height;
    //         newSize = first.height + sizeUpdate.event.yy;
    //       }
    //       // find the percentage of the new size according to totalPercentage
    //       const percentage = (newSize / total) * totalPercentage;
    //       first.updateSize(percentage);
    //       second.updateSize(totalPercentage - percentage);
    //     }
    //   },
    //   { allowSignalWrites: true },
    // );
  }
}
