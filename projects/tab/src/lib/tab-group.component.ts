import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
  template: `<div class="flex gap-4 border-b">
      @for (tab of tabs(); track $index) {
        <button
          class="border-b-2 border-transparent px-4 py-2 text-muted"
          [class]="
            $index === activeIndex() ? '!border-primary !text-black' : ''
          "
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
  // activeSelect = computed(() => {
  //   const tabs = this.tabs();
  //   const activeIndex = this.activeIndex();
  //   const tab = tabs[activeIndex];
  //   return `[title="${tab.title()}"]`;
  // });

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
