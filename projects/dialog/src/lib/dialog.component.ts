import {
  Component,
  ViewContainerRef,
  ChangeDetectionStrategy,
  viewChild,
  afterNextRender,
} from '@angular/core';
import { Subject, BehaviorSubject, filter } from 'rxjs';
import { DialogOptions } from './dialog-ref';
import { CommonModule } from '@angular/common';
import { NguModalViewAnimation } from './dialog.animation';
import { Separator } from '@meeui/separator';
import { Button } from '@meeui/button';

@Component({
  standalone: true,
  imports: [CommonModule, Separator, Button],
  selector: 'mee-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pointer-events-none flex h-full items-center justify-center">
      <div
        class="bg-bg pointer-events-auto flex flex-col overflow-hidden rounded-md p-4 shadow-2xl"
        [class]="options.fullWindow ? 'full-window' : ''"
        [ngStyle]="{ width: options.width }"
        [@viewAnimation]
      >
        <div
          *ngIf="!isHideHeader"
          class="bg-secondary-background flex h-8 items-center"
        >
          <h2 class="flex-1 font-bold">{{ options.title }}</h2>
          <button
            meeButton
            (click)="backdrop.next('close')"
            class="mr-1"
          ></button>
        </div>
        <div class="h-full overflow-auto">
          <ng-container #myDialog></ng-container>
        </div>
      </div>
    </div>
    @if (backdropColor && !options.fullWindow) {
      <div
        class="backdropColor absolute top-0 -z-10 h-full w-full"
        (click)="backdrop.next('close')"
      ></div>
    }
  `,
  host: {
    '[ngStyle]': '{ "z-index": options.overrideLowerDialog ? "982" : "980" }',
    class: 'fixed block top-0 bottom-0 left-0 right-0 overflow-auto',
  },
  styles: `
    .backdropColor {
      background: rgba(102, 102, 102, 0.32);
    }

    .full-window {
      width: 100vw !important;
      height: 100vh;
      max-width: initial;
      top: 0;
      border-radius: 0;
    }
  `,
  animations: [NguModalViewAnimation],
})
export class DialogComponent {
  myDialog = viewChild('myDialog', { read: ViewContainerRef });

  backdrop = new Subject<'close'>();

  private afterViewSource = new BehaviorSubject<ViewContainerRef | null>(null);
  afterView = this.afterViewSource.asObservable().pipe(filter(Boolean));

  backdropColor = true;
  isSidePopup = true;

  options!: DialogOptions;
  classNames = '';
  isHideHeader = false;

  constructor() {
    afterNextRender(() => {
      this.afterViewSource.next(this.myDialog()!);
    });
  }

  setOptions(options: DialogOptions) {
    this.options = options;
    this.classNames = this.options.classNames?.join(' ') || '';
    this.isHideHeader = this.options.isHideHeader || false;
    this.backdropColor = this.options.backdropColor || true;
  }
}
