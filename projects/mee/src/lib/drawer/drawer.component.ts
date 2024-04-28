import {
  ChangeDetectionStrategy,
  Component,
  ViewContainerRef,
  afterNextRender,
  viewChild,
} from '@angular/core';
import { BaseDialogComponent, DialogOptions } from '../portal';
import { NgStyle } from '@angular/common';
import { fadeAnimation, sideAnimation } from '../dialog/dialog.animation';
import { DragDirective } from '../drag';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'mee-drawer',
  standalone: true,
  imports: [NgStyle, DragDirective],
  template: `
    <div class="pointer-events-none flex h-full flex-col justify-end">
      <div
        class="bg-foreground pointer-events-auto flex flex-col overflow-hidden rounded-tl-2xl rounded-tr-2xl border-t border-border p-4 shadow-2xl"
        [@sideAnimation]
      >
        <button class="mx-auto h-2 w-20 rounded-full bg-muted"></button>
        @if (!isHideHeader) {
          <div class="flex h-8 items-center">
            <h2 class="flex-1 font-bold">{{ options.title }}</h2>
            <button meeButton (click)="close()" class="mr-1"></button>
          </div>
        }
        <div class="h-full overflow-auto">
          <ng-container #myDialog></ng-container>
        </div>
      </div>
    </div>
    @if (backdropColor) {
      <div
        class="backdropColor absolute top-0 -z-10 h-full w-full"
        (click)="close()"
        [@fadeAnimation]
      ></div>
    }
  `,
  host: {
    class: 'fixed block top-0 bottom-0 left-0 right-0 overflow-auto',
    '[ngStyle]': '{ "z-index": options.overrideLowerDialog ? "982" : "980" }',
  },
  styles: `
    .backdropColor {
      background: rgba(0, 0, 0, 0.6);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('sideAnimation', [
      state('1', style({ transform: 'none' })),
      state('void', style({ transform: 'translate3d(0, 100%, 0)' })),
      state('0', style({ transform: 'translate3d(0, 100%, 0)' })),
      transition('* => *', animate('200ms ease')),
    ]),
    fadeAnimation,
  ],
})
export class Drawer extends BaseDialogComponent {
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
