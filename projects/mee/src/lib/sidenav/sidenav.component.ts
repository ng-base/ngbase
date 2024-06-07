import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  contentChild,
  effect,
  input,
} from '@angular/core';
import { SidenavHeader } from './sidenav-header.component';

@Component({
  standalone: true,
  selector: 'mee-sidenav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- <div [@slide]="show()" class="absolute h-full"> -->
    <ng-content select="mee-sidenav-header" />
    <!-- </div> -->
    <!-- <div
      [style.paddingLeft.px]="left()"
      [class.transition-all]="this.headerWidth()"
      class="h-full w-full"
    > -->
    <ng-content />
    <!-- </div> -->
  `,
  host: {
    class: 'flex w-full overflow-hidden relative top-0 left-0 h-full',
  },
  animations: [],
})
export class Sidenav {
  show = input(true);
  header = contentChild(SidenavHeader, { read: ElementRef });
  headerWidth = computed(() => this.header()?.nativeElement.offsetWidth || 0);
  left = computed(() => (this.show() ? this.headerWidth() : 0));

  constructor() {
    // console.log(this.headerWidth());
    // effect(() => {
    //   console.log(this.headerWidth());
    // });
  }
}
