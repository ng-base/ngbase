import {
  Component,
  ViewContainerRef,
  ChangeDetectionStrategy,
  viewChild,
  afterNextRender,
} from '@angular/core';
import { BaseDialogComponent, DialogOptions } from '../portal';
import { NgStyle } from '@angular/common';
import { NguModalViewAnimation, fadeAnimation } from './dialog.animation';
import { Separator } from '../separator';
import { Button } from '../button';

@Component({
  standalone: true,
  imports: [NgStyle, Separator, Button],
  selector: 'mee-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pointer-events-none flex h-full items-center justify-center">
      <div
        class="bg-foreground pointer-events-auto flex flex-col overflow-hidden rounded-md border border-border p-4 shadow-2xl"
        [class]="options.fullWindow ? 'full-window' : ''"
        [ngStyle]="{ width: options.width }"
        [@viewAnimation]
      >
        @if (!isHideHeader) {
          <div class="bg-secondary-background flex h-8 items-center">
            <h2 class="flex-1 font-bold">{{ options.title }}</h2>
            <button meeButton (click)="close()" class="mr-1"></button>
          </div>
        }
        <div class="h-full overflow-auto">
          <ng-container #myDialog></ng-container>
        </div>
      </div>
    </div>
    @if (backdropColor && !options.fullWindow) {
      <div
        class="backdropColor absolute top-0 -z-10 h-full w-full"
        (click)="close()"
        [@fadeAnimation]
      ></div>
    }
  `,
  host: {
    '[ngStyle]': '{ "z-index": options.overrideLowerDialog ? "982" : "980" }',
    class: 'fixed block top-0 bottom-0 left-0 right-0 overflow-auto',
  },
  styles: `
    .backdropColor {
      background: rgba(0, 0, 0, 0.32);
      // background: rgba(102, 102, 102, 0.32);
    }

    .full-window {
      width: 100vw !important;
      height: 100vh;
      max-width: initial;
      top: 0;
      border-radius: 0;
    }
  `,
  animations: [NguModalViewAnimation, fadeAnimation],
})
export class DialogComponent extends BaseDialogComponent {
  myDialog = viewChild('myDialog', { read: ViewContainerRef });

  backdropColor = true;
  isSidePopup = true;

  options!: DialogOptions;
  classNames = '';
  isHideHeader = false;

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
