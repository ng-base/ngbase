import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
import {
  NgbDialogBackdrop,
  NgbDialogContainer,
  NgbDialogMain,
  ngbDialogPortal,
  provideDialog,
  NgbDialog,
  NgbDialogClose,
} from '@ngbase/adk/dialog';
import { DragMove } from '@ngbase/adk/drag';
import { Button } from '@meeui/ui/button';
import { Icon } from '@meeui/ui/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';

@Component({
  selector: 'mee-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideDialog(DialogContainer)],
  viewProviders: [provideIcons({ lucideX })],
  imports: [Button, Icon, DragMove, NgbDialogMain, NgbDialogBackdrop],
  template: `
    <div class="pointer-events-none flex h-full items-center justify-center">
      <div
        #myDialog
        ngbDialogMain
        [@viewAnimation]
        class="{{
          'pointer-events-auto relative flex max-w-[100vw] flex-col overflow-hidden border bg-foreground shadow-lg' +
            (options().fullWindow
              ? ' h-screen w-screen border-none'
              : ' max-w-[calc(100vw-30px)] rounded-lg')
        }}"
      >
        @if (!isHideHeader) {
          <div
            class="flex items-center justify-between border-b px-4 py-2"
            ngbDragMove
            [target]="myDialog"
          >
            <h2 class="flex-1 text-base font-bold">{{ options().title }}</h2>
            @if (!options().disableClose) {
              <button meeButton="ghost" class="-mr-2 !p-2" (click)="close()">
                <mee-icon name="lucideX" />
              </button>
            }
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
    class: 'fixed block top-0 bottom-0 left-0 right-0 overflow-auto pointer-events-none z-p',
  },
})
export class DialogContainer extends NgbDialogContainer {}

@Directive({
  selector: '[meeDialogClose]',
  hostDirectives: [NgbDialogClose],
})
export class DialogClose {}

@Component({
  selector: '[meeDialogTitle]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'text-lg font-semibold',
  },
})
export class DialogTitle {}

export function dialogPortal() {
  return ngbDialogPortal(DialogContainer);
}

export type Dialog = NgbDialog;
