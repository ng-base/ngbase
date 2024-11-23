import { NgClass, NgStyle } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { FocusTrap } from '@meeui/adk/a11y';
import { DragMove } from '@meeui/adk/drag';
import { Button } from '@meeui/ui/button';
import { Icon } from '@meeui/ui/icon';
import { BaseDialog, DialogOptions } from '@meeui/ui/portal';
import { provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { Subject } from 'rxjs';
import { createHostAnimation, fadeAnimation, viewAnimation } from './dialog.animation';

@Component({
  selector: 'mee-dialog',
  imports: [NgStyle, Button, NgClass, Icon, DragMove],
  viewProviders: [provideIcons({ lucideX })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pointer-events-none flex h-full items-center justify-center">
      <div
        #myDialog
        [@viewAnimation]
        class="pointer-events-auto relative flex max-w-[100vw] flex-col overflow-hidden border bg-foreground shadow-lg"
        [ngClass]="[
          options.fullWindow
            ? 'h-screen w-screen border-none'
            : 'max-w-[calc(100vw-30px)] rounded-base',
          classNames,
        ]"
        [ngStyle]="{
          width: options.fullWindow ? '100vw' : options.width,
          height: options.fullWindow ? '100vh' : options.height,
          maxWidth: options.fullWindow ? '100vw' : options.maxWidth,
          maxHeight: options.fullWindow ? '100vh' : options.maxHeight || '96vh',
          minHeight: options.minHeight,
          minWidth: options.minWidth,
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
              <button
                type="button"
                meeButton
                variant="ghost"
                class="-mr-b2 !p-b2"
                (click)="close()"
              >
                <mee-icon name="lucideX" />
              </button>
            }
          </div>
        }
        <div class="h-full overflow-auto p-b4">
          <ng-container #contentContainer />
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
export class DialogContainer extends BaseDialog {
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
    this.isHideHeader = this.options.header || false;
    this.backdropColor = this.options.backdropColor || true;
  }
}
