import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { createHostAnimation, fadeAnimation } from '@meeui/ui/dialog';
import { BaseDialog, DialogOptions } from '@meeui/ui/portal';
import { Subject } from 'rxjs';

@Component({
  selector: 'mee-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pointer-events-none flex h-full items-center justify-center">
      <div class="pointer-events-auto">
        <ng-container #myDialog />
      </div>
      <div
        class="backdropColor pointer-events-auto absolute top-0 -z-10 h-full w-full"
        (click)="!options.disableClose && close()"
        [@fadeAnimation]=""
      ></div>
    </div>
  `,
  host: {
    '[ngStyle]': '{ "z-index": options.overrideLowerDialog ? "982" : "980" }',
    class: 'fixed block top-0 bottom-0 left-0 right-0 overflow-auto pointer-events-none z-p',
    '[@parentAnimation]': '',
  },
  styles: `
    .backdropColor {
      background: rgba(0, 0, 0, 0.32);
    }

    .full-window {
      width: 100vw !important;
      height: 100vh;
      max-width: initial;
      top: 0;
      border-radius: 0;
    }
  `,
  animations: [createHostAnimation(['@fadeAnimation']), fadeAnimation('300ms')],
})
export class PicasaBase extends BaseDialog {
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
    //   setTimeout(() => {
    //     this.animationDone();
    //   }, 500);
    // });
  }

  override setOptions(options: DialogOptions) {
    this.options = options;
    this.classNames = this.options.classNames?.join(' ') || '';
    this.isHideHeader = this.options.header || false;
    this.backdropColor = this.options.backdropColor || true;
  }
}
