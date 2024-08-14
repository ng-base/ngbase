import {
  ChangeDetectionStrategy,
  Component,
  ViewContainerRef,
  afterNextRender,
  viewChild,
} from '@angular/core';
import { BaseDialog, DialogOptions } from '../portal';
import { NgStyle } from '@angular/common';
import { createHostAnimation, fadeAnimation, sideAnimation } from '../dialog/dialog.animation';
import { Button } from '../button';
import { Icons } from '../icon';
import { provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';

@Component({
  selector: 'mee-sheet',
  standalone: true,
  imports: [NgStyle, Button, Icons],
  viewProviders: [provideIcons({ lucideX })],
  template: `
    <div class="pointer-events-none flex h-full justify-end">
      <div
        class="pointer-events-auto m-b2 flex flex-col overflow-hidden rounded-base border-l bg-foreground shadow-2xl will-change-transform"
        [@sideAnimation]
        [ngStyle]="{
          width: options.width,
          minWidth: options.minWidth,
          maxWidth: options.maxWidth,
        }"
      >
        @if (!isHideHeader) {
          <div class="flex items-center border-b px-b4 py-b2">
            <h2 class="flex-1 font-bold">{{ options.title }}</h2>
            <button meeButton variant="ghost" class="-mr-b2 !p-b2" (click)="close()">
              <mee-icon name="lucideX"></mee-icon>
            </button>
          </div>
        }
        <div class="h-full overflow-auto p-b4">
          <ng-container #myDialog></ng-container>
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
export class Sheet extends BaseDialog {
  myDialog = viewChild('myDialog', { read: ViewContainerRef });
  backdropColor = true;
  options!: DialogOptions;
  classNames = '';
  isHideHeader = false;

  constructor() {
    super();
    afterNextRender(() => {
      this._afterViewSource.next(this.myDialog()!);
    });
  }

  override setOptions(options: DialogOptions): void {
    this.options = options;
    this.classNames = this.options.classNames?.join(' ') || '';
    this.isHideHeader = this.options.isHideHeader || false;
    this.backdropColor = this.options.backdropColor || true;
  }
}
