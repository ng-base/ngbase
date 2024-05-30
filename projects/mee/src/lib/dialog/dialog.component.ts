import {
  Component,
  ViewContainerRef,
  ChangeDetectionStrategy,
  viewChild,
  afterNextRender,
  signal,
} from '@angular/core';
import { BaseDialog, DialogOptions } from '../portal';
import { NgClass, NgStyle } from '@angular/common';
import { NguModalViewAnimation, fadeAnimation } from './dialog.animation';
import { Separator } from '../separator';
import { Button } from '../button';
import { Subject } from 'rxjs';

@Component({
  standalone: true,
  imports: [NgStyle, Separator, Button, NgClass],
  selector: 'mee-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pointer-events-none flex h-full items-center justify-center">
      <div
        class="pointer-events-auto relative flex flex-col overflow-hidden rounded-base border border-border bg-foreground"
        [ngClass]="[options.fullWindow ? 'full-window' : '', classNames]"
        [ngStyle]="{
          width: options.width,
          maxWidth: options.maxWidth,
          maxHeight: options.maxHeight || '96vh'
        }"
        [@viewAnimation]="status() ? 1 : 0"
      >
        @if (!isHideHeader) {
          <div class="bg-secondary-background flex items-center px-b pb-h pt-b">
            <h2 class="flex-1 text-base font-bold">{{ options.title }}</h2>
          </div>
        }
        @if (!options.disableClose) {
          <button
            meeButton
            variant="ghost"
            (click)="close()"
            class="absolute right-1 top-h mr-1"
          >
            X
          </button>
        }
        <div class="h-full overflow-auto p-b">
          <ng-container #myDialog></ng-container>
        </div>
      </div>
      @if (!options.fullWindow && options.backdrop) {
        <div
          class="backdropColor pointer-events-auto absolute top-0 -z-10 h-full w-full"
          (click)="!options.disableClose && close()"
          [@fadeAnimation]="status() ? 1 : 0"
          (@fadeAnimation.done)="animationDone()"
        ></div>
      }
    </div>
  `,
  host: {
    '[ngStyle]': '{ "z-index": options.overrideLowerDialog ? "982" : "980" }',
    class:
      'fixed block top-0 bottom-0 left-0 right-0 overflow-auto pointer-events-none',
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
export class Dialog extends BaseDialog {
  myDialog = viewChild('myDialog', { read: ViewContainerRef });

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

      // setTimeout(() => {
      //   this.show.set(false);
      // }, 2000);
    });
    // this.dialogRef.afterClosed.subscribe(() => {
    //   this.status.set(false);
    // });
  }

  override setOptions(options: DialogOptions) {
    this.options = options;
    this.classNames = this.options.classNames?.join(' ') || '';
    this.isHideHeader = this.options.isHideHeader || false;
    this.backdropColor = this.options.backdropColor || true;
  }
}
