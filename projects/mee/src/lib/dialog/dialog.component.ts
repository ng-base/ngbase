import {
  Component,
  ViewContainerRef,
  ChangeDetectionStrategy,
  viewChild,
  afterNextRender,
  signal,
  OnDestroy,
} from '@angular/core';
import { BaseDialog, DialogOptions } from '../portal';
import { NgClass, NgStyle } from '@angular/common';
import { viewAnimation, createHostAnimation, fadeAnimation } from './dialog.animation';
import { Separator } from '../separator';
import { Button } from '../button';
import { Subject } from 'rxjs';
import { Icons } from '../icon';
import { provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { DragMove } from '../drag';
import { FocusTrap } from '@meeui/utils/focus-trap.directive';

@Component({
  standalone: true,
  selector: 'mee-dialog',
  imports: [NgStyle, Separator, Button, NgClass, Icons, DragMove, FocusTrap],
  viewProviders: [provideIcons({ lucideX })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pointer-events-none flex h-full items-center justify-center">
      <div
        #myDialog
        [@viewAnimation]
        class="pointer-events-auto relative flex max-w-[100vw] flex-col overflow-hidden rounded-base border bg-foreground shadow-lg"
        [ngClass]="[
          options.fullWindow ? 'h-screen w-screen border-none' : 'max-w-[calc(100vw-30px)]',
          classNames,
        ]"
        [ngStyle]="{
          width: options.width,
          height: options.height,
          maxWidth: options.maxWidth,
          maxHeight: options.maxHeight || '96vh',
        }"
      >
        @if (!isHideHeader) {
          <div
            class="flex items-center justify-between border-b px-b4 py-b2"
            meeDragMove
            [target]="myDialog"
          >
            <h2 class="flex-1 text-base font-bold">{{ options.title }}</h2>
            @if (!options.disableClose) {
              <button meeButton variant="ghost" class="-mr-b2 !p-b2" (click)="close()">
                <mee-icon name="lucideX"></mee-icon>
              </button>
            }
          </div>
        }
        <div class="h-full overflow-auto p-b4">
          <ng-container #contentContainer></ng-container>
        </div>
      </div>
      @if (!options.fullWindow && options.backdrop) {
        <div
          class="pointer-events-auto absolute top-0 -z-10 h-full w-full bg-black bg-opacity-30"
          (click)="!options.disableClose && close()"
          [@fadeAnimation]
        ></div>
      }
    </div>
  `,
  host: {
    '[ngStyle]': '{ "z-index": options.overrideLowerDialog ? "982" : "980" }',
    class: 'fixed block top-0 bottom-0 left-0 right-0 overflow-auto pointer-events-none z-p',
    '[@parentAnimation]': '',
    '(@parentAnimation.done)': 'animationDone()',
  },
  hostDirectives: [FocusTrap],
  animations: [
    createHostAnimation(['@viewAnimation', '@fadeAnimation']),
    fadeAnimation('200ms'),
    viewAnimation,
  ],
})
export class Dialog extends BaseDialog {
  myDialog = viewChild('contentContainer', { read: ViewContainerRef });

  backdropColor = true;
  isSidePopup = true;

  options!: DialogOptions;
  classNames = '';
  isHideHeader = false;
  onDone = new Subject<any>();

  constructor() {
    super();
    afterNextRender(() => {
      this._afterViewSource.next(this.myDialog()!);
    });
  }

  override setOptions(options: DialogOptions) {
    this.options = options;
    this.classNames = this.options.classNames?.join(' ') || '';
    this.isHideHeader = this.options.isHideHeader || false;
    this.backdropColor = this.options.backdropColor || true;
  }
}
