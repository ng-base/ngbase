import { NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  ViewContainerRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { BaseDialog, DialogRef } from '@ngbase/adk/portal';
import { createHostAnimation, fadeAnimation } from '@ngbase/adk/utils';
import { Button } from '@meeui/ui/button';
import { sideAnimation } from '@ngbase/adk/dialog';
import { Icon } from '@meeui/ui/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { SheetOptions } from './sheet.service';

@Component({
  selector: 'mee-sheet',
  imports: [NgStyle, Button, Icon],
  viewProviders: [provideIcons({ lucideX })],
  template: `
    <div
      class="pointer-events-none flex h-full"
      [class]="options.position === 'left' ? 'justify-start' : 'justify-end'"
    >
      <div
        class="pointer-events-auto m-2 flex flex-col overflow-hidden rounded-lg border-l bg-foreground shadow-2xl will-change-transform"
        [@sideAnimation]="position()"
        [ngStyle]="{
          width: options.width,
          minWidth: options.minWidth,
          maxWidth: options.maxWidth,
        }"
      >
        @if (!isHideHeader) {
          <div class="flex items-center border-b px-4 py-2">
            <h2 class="flex-1 font-bold">{{ options.title }}</h2>
            <button meeButton="ghost" class="-mr-2 !p-2" (click)="close()">
              <mee-icon name="lucideX" />
            </button>
          </div>
        }
        <div class="h-full overflow-auto p-4">
          <ng-container #myDialog />
        </div>
      </div>
    </div>
    @if (backdropColor) {
      <div
        class="absolute top-0 -z-10 h-full w-full bg-black bg-opacity-30 will-change-transform"
        [@fadeAnimation]
        (click)="close()"
      ></div>
      <!-- [class]="status() ? 'pointer-events-auto' : 'pointer-events-none'" -->
    }
  `,
  host: {
    class: 'fixed block top-0 bottom-0 left-0 right-0  z-p',
    '[@parentAnimation]': '',
    '(@parentAnimation.done)': 'animationDone()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    createHostAnimation(['@fadeAnimation', '@sideAnimation']),
    fadeAnimation('300ms'),
    sideAnimation,
  ],
})
export class SheetContainer extends BaseDialog implements OnDestroy {
  myDialog = viewChild('myDialog', { read: ViewContainerRef });
  backdropColor = true;
  options!: SheetOptions;
  classNames = '';
  isHideHeader = false;
  position = signal<'left' | 'right' | 'center'>('left');

  constructor() {
    super();
    afterNextRender(() => {
      this._afterViewSource.next(this.myDialog()!);
      this.position.set('center');
    });
    const ref = inject(DialogRef);
    ref.afterClosed.subscribe(() => {
      console.log('afterClosed', this.options.position);
      this.position.set(this.options.position as 'left' | 'right' | 'center');
    });
  }

  override setOptions(options: SheetOptions): void {
    this.options = options;
    this.classNames = this.options.classNames?.join(' ') || '';
    this.isHideHeader = this.options.header || false;
    this.backdropColor = this.options.backdropColor || true;
    this.position.set(this.options.position as 'left' | 'right' | 'center');
  }

  ngOnDestroy(): void {
    // this.position.set(this.options.position as 'left' | 'right' | 'center');
  }
}
