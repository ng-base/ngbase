import {
  ChangeDetectionStrategy,
  Component,
  ViewContainerRef,
  afterNextRender,
  viewChild,
} from '@angular/core';
import { BaseDialog, DialogOptions } from '../portal';
import { NgStyle } from '@angular/common';
import { fadeAnimation, sideAnimation } from '../dialog/dialog.animation';
import { Button } from '../button';

@Component({
  selector: 'mee-sheet',
  standalone: true,
  imports: [NgStyle, Button],
  template: `
    <div class="pointer-events-none flex h-full justify-end">
      <div
        class="pointer-events-auto flex flex-col overflow-hidden border-l bg-foreground shadow-2xl"
        [ngStyle]="{ width: options.width }"
        [@sideAnimation]="status() ? 1 : 0"
        (@sideAnimation.done)="animationDone()"
      >
        @if (!isHideHeader) {
          <div class="bg-secondary-background px-b4 flex items-center py-b2">
            <h2 class="flex-1 font-bold">{{ options.title }}</h2>
            <button
              meeButton
              variant="ghost"
              (click)="close()"
              class="small mr-1"
            >
              x
            </button>
          </div>
        }
        <div class="p-b4 h-full overflow-auto">
          <ng-container #myDialog></ng-container>
        </div>
      </div>
    </div>
    @if (backdropColor) {
      <div
        class="backdropColor absolute top-0 -z-10 h-full w-full"
        [class]="status() ? 'pointer-events-auto' : 'pointer-events-none'"
        (click)="close()"
        [@fadeAnimation]="status() ? 1 : 0"
      ></div>
    }
  `,
  host: {
    class: 'fixed block top-0 bottom-0 left-0 right-0 overflow-auto ',
    '[ngStyle]': '{ "z-index": options.overrideLowerDialog ? "982" : "980" }',
  },
  styles: `
    .backdropColor {
      // background: rgba(102, 102, 102, 0.32);
      background: rgb(0 0 0 / 50%);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [sideAnimation, fadeAnimation],
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
