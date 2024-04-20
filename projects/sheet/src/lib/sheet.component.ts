import {
  ChangeDetectionStrategy,
  Component,
  ViewContainerRef,
  afterNextRender,
  viewChild,
} from '@angular/core';
import {
  BaseDialogComponent,
  DialogOptions,
} from '../../../dialog/src/lib/dialog-ref';
import { NgStyle } from '@angular/common';
import {
  fadeAnimation,
  sideAnimation,
} from '../../../dialog/src/lib/dialog.animation';

@Component({
  selector: 'mee-sheet',
  standalone: true,
  imports: [NgStyle],
  template: `
    <div class="pointer-events-none flex h-full justify-end">
      <div
        class="bg-bg pointer-events-auto flex flex-col overflow-hidden rounded-md p-4 shadow-2xl"
        [ngStyle]="{ width: options.width }"
        [@sideAnimation]="true"
      >
        @if (!isHideHeader) {
          <div class="bg-secondary-background flex h-8 items-center">
            <h2 class="flex-1 font-bold">{{ options.title }}</h2>
            <button
              meeButton
              (click)="backdrop.next('close')"
              class="mr-1"
            ></button>
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
        (click)="backdrop.next('close')"
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
      background: rgba(102, 102, 102, 0.32);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [sideAnimation, fadeAnimation],
})
export class SheetComponent extends BaseDialogComponent {
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
