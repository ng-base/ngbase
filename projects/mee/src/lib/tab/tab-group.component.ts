import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  effect,
  model,
} from '@angular/core';
import { Tab } from './tab.component';
import { NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'mee-tab-group',
  standalone: true,
  imports: [NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="border-border flex gap-4 border-b">
      @for (tab of tabs(); track $index) {
        <button
          class="border-b-2 border-transparent px-4 py-2 text-muted"
          [class]="$index === activeIndex() ? '!text-text !border-primary' : ''"
          (click)="activeIndex.set($index)"
        >
          {{ tab.title() }}
        </button>
      }
    </div>
    <ng-content></ng-content> `,
  styles: ``,
})
export class TabGroup {
  tabs = contentChildren(Tab);
  activeIndex = model(0);

  constructor() {
    effect(
      () => {
        const tabs = this.tabs();
        const activeIndex = this.activeIndex();

        tabs.forEach((tab, index) => {
          tab.active.set(activeIndex === index);
        });
      },
      { allowSignalWrites: true },
    );
  }
}
