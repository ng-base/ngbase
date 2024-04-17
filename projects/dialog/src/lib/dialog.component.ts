import {
  Component,
  ViewContainerRef,
  AfterViewInit,
  ElementRef,
  OnDestroy,
  ChangeDetectionStrategy,
  viewChild,
} from '@angular/core';
import { Subject, BehaviorSubject, filter } from 'rxjs';
import { DialogOptions } from './dialog-ref';
import { CommonModule } from '@angular/common';
import {
  NguModalSideAnimation,
  NguModalViewAnimation,
} from './dialog.animation';
import { Separator } from '@meeui/separator';

@Component({
  standalone: true,
  imports: [CommonModule, Separator],
  selector: 'mee-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      #dialogContainer
      class="center-container"
      [ngStyle]="{ width: options.width }"
      [ngClass]="options.fullWindow ? 'full-window' : ''"
      (click)="test($event)"
    >
      <div
        class="content-container flex flex-col overflow-hidden bg-bg-primary p-4"
        [@viewAnimation]
        [ngClass]="classNames"
      >
        <div #dialogHeader>
          <div
            *ngIf="!isHideHeader"
            class="content-header bg-secondary-background h-8"
          >
            <h2>{{ options.title }}</h2>
            <button
              bot-icon-button-small
              iconName="close"
              (click)="backdrop.next('close')"
              class="mr-1"
            ></button>
          </div>
        </div>
        <div class="h-full overflow-auto">
          <ng-container #myDialog></ng-container>
        </div>
      </div>
    </div>
  `,
  host: {
    '(click)': 'backdrop.next($event);',
    '[class.backdropColor]': 'backdropColor',
    '[ngStyle]': '{ "z-index": options.overrideLowerDialog ? "982" : "980" }',
  },
  styles: `
    :host {
      position: fixed;
      display: block;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      overflow: auto;
      &.backdropColor {
        background: rgba(102, 102, 102, 0.32);
      }
    }
    .center-container-overlay {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      height: 100%;
    }
    .center-container {
      position: absolute;
      width: min-content;
      top: 50px;
      max-width: calc(100vw - 30px);
      left: 0;
      right: 0;
      margin: auto;
      @apply pb-6;
      .content-container {
        // @apply p-2.5;
        border-radius: 10px;
        box-shadow:
          0 11px 15px -7px rgba(0, 0, 0, 0.2),
          0 24px 38px 3px rgba(0, 0, 0, 0.14),
          0 9px 46px 8px rgba(0, 0, 0, 0.12);
        box-sizing: border-box;
      }
      &.test-side-overlay {
        top: 0;
        height: 100%;
        right: 0;
        margin: 0;
        left: auto;
        border-radius: 0;
        overflow: hidden;
        .content-container {
          padding: 24px;
          overflow: auto;
          max-height: 100%;
        }
      }
    }
    .testerr {
      position: absolute;
      background: rgba(102, 102, 102, 0.32);
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      right: 0;
      z-index: -1;
    }

    .content-header {
      @apply flex items-center;
      h2 {
        flex: 1;
        font-weight: 900;
      }
    }

    .full-window {
      width: 100vw !important;
      height: 100vh;
      max-width: initial;
      padding: 0;
      top: 0;

      .content-container {
        border-radius: 0;
        height: 100%;
      }
    }
  `,
  animations: [NguModalViewAnimation, NguModalSideAnimation],
})
export class DialogComponent implements AfterViewInit, OnDestroy {
  myDialog = viewChild('myDialog', { read: ViewContainerRef });
  dialogHeader = viewChild<ElementRef<HTMLElement>>('dialogHeader');
  dialogContainer = viewChild<ElementRef<HTMLElement>>('dialogContainer');

  backdrop = new Subject<'close'>();

  backdropColor = true;
  isSidePopup = true;
  private afterViewSource = new BehaviorSubject<ViewContainerRef | null>(null);
  afterView = this.afterViewSource.asObservable().pipe(filter(Boolean));
  options!: DialogOptions;
  classNames = '';
  isHideHeader = false;

  setOptions(options: DialogOptions) {
    this.options = options;
    this.classNames = this.options.classNames?.join(' ') || '';
    this.isHideHeader = this.options.isHideHeader || false;
  }

  ngAfterViewInit() {
    this.afterViewSource.next(this.myDialog()!);
  }

  test(ev: MouseEvent) {
    ev.stopPropagation();
  }

  ngOnDestroy(): void {}
}
