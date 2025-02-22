import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  inject,
  signal,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { FocusTrap } from '@ngbase/adk/a11y';
import { BaseDialog, DialogOptions, NgbPortalClose } from '@ngbase/adk/portal';
import { createHostAnimation, fadeAnimation } from '@ngbase/adk/utils';
import { Subject } from 'rxjs';
import { viewAnimation } from './dialog.animation';

@Directive({
  selector: '[ngbDialogMain]',
  host: {
    '[class]': `classNames()`,
    '[style]': `style()`,
  },
})
export class NgbDialogMain {
  readonly dialog = inject(NgbDialogContainer);
  readonly options = this.dialog.options;
  readonly classNames = computed(() => this.options().classNames?.join(' ') || '');
  readonly style = computed(() => {
    return {
      width: this.options().fullWindow ? '100vw' : this.options().width,
      height: this.options().fullWindow ? '100vh' : this.options().height,
      maxWidth: this.options().fullWindow ? '100vw' : this.options().maxWidth,
      maxHeight: this.options().fullWindow ? '100vh' : this.options().maxHeight || '96vh',
      minHeight: this.options().minHeight,
      minWidth: this.options().minWidth,
    };
  });
}

@Directive({
  selector: '[ngbDialogBackdrop]',
  host: {
    '(click)': `close()`,
  },
})
export class NgbDialogBackdrop {
  readonly dialog = inject(NgbDialogContainer);
  readonly options = this.dialog.options;

  close() {
    if (!this.options().disableClose) {
      this.dialog.close();
    }
  }
}

@Component({
  selector: '[ngbDialog]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [FocusTrap],
  imports: [NgbDialogMain, NgbDialogBackdrop],
  template: `
    <div class="pointer-events-none flex h-full items-center justify-center">
      <div
        [@viewAnimation]
        ngbDialogMain
        class="{{
          'pointer-events-auto relative flex max-w-[100vw] flex-col overflow-hidden border bg-foreground shadow-lg' +
            (options().fullWindow
              ? ' h-screen w-screen border-none'
              : ' max-w-[calc(100vw-30px)] rounded-lg')
        }}"
      >
        @if (!isHideHeader) {
          <div class="flex items-center justify-between border-b px-4 py-2">
            <h2>{{ options().title }}</h2>
          </div>
        }
        <div class="h-full overflow-auto p-4">
          <ng-container #contentContainer />
        </div>
      </div>
      @if (showBackdrop()) {
        <div
          class="pointer-events-auto absolute top-0 -z-10 h-full w-full bg-black bg-opacity-30"
          ngbDialogBackdrop
          [@fadeAnimation]
        ></div>
      }
    </div>
  `,
  host: {
    '[style]': '{ "z-index": options.overrideLowerDialog ? "982" : "980" }',
    '[@parentAnimation]': '',
    '(@parentAnimation.done)': 'animationDone()',
  },
  animations: [
    createHostAnimation(['@viewAnimation', '@fadeAnimation']),
    fadeAnimation('200ms'),
    viewAnimation,
  ],
})
export class NgbDialogContainer extends BaseDialog {
  readonly myDialog = viewChild('contentContainer', { read: ViewContainerRef });

  backdropColor = true;
  isSidePopup = true;

  readonly onDone = new Subject<any>();
  readonly options = signal<DialogOptions>(new DialogOptions());
  readonly showBackdrop = computed(() => !this.options().fullWindow && this.options().backdrop);
  isHideHeader = false;

  constructor() {
    super();
    afterNextRender(() => {
      this._afterViewSource.next(this.myDialog()!);
    });
  }

  override setOptions(options: DialogOptions) {
    this.options.set(options);
    this.isHideHeader = options.header || false;
    this.backdropColor = options.backdropColor || true;
  }
}

@Directive({
  selector: '[ngbDialogClose]',
  hostDirectives: [{ directive: NgbPortalClose, inputs: ['ngbPortalClose: ngbDialogClose'] }],
})
export class NgbDialogClose {}

export function provideDialog(dialog: typeof NgbDialogContainer) {
  return {
    provide: NgbDialogContainer,
    useExisting: dialog,
  };
}
