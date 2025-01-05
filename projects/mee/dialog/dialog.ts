import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  MeeDialogBackdrop,
  MeeDialogContainer,
  MeeDialogMain,
  meeDialogPortal,
  provideDialog,
  MeeDialog,
} from '@meeui/adk/dialog';
import { DragMove } from '@meeui/adk/drag';
import { Button } from '@meeui/ui/button';
import { Icon } from '@meeui/ui/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';

@Component({
  selector: 'mee-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideDialog(DialogContainer)],
  viewProviders: [provideIcons({ lucideX })],
  imports: [Button, Icon, DragMove, MeeDialogMain, MeeDialogBackdrop],
  template: `
    <div class="pointer-events-none flex h-full items-center justify-center">
      <div
        #myDialog
        meeDialogMain
        [@viewAnimation]
        class="{{
          'pointer-events-auto relative flex max-w-[100vw] flex-col overflow-hidden border bg-foreground shadow-lg' +
            (options().fullWindow
              ? ' h-screen w-screen border-none'
              : ' max-w-[calc(100vw-30px)] rounded-base')
        }}"
      >
        @if (!isHideHeader) {
          <div
            class="flex items-center justify-between border-b px-b4 py-b2"
            meeDragMove
            [target]="myDialog"
          >
            <h2 class="flex-1 text-base font-bold">{{ options().title }}</h2>
            @if (!options().disableClose) {
              <button meeButton="ghost" class="-mr-b2 !p-b2" (click)="close()">
                <mee-icon name="lucideX" />
              </button>
            }
          </div>
        }
        <div class="h-full overflow-auto p-b4">
          <ng-container #contentContainer />
        </div>
      </div>
      @if (showBackdrop()) {
        <div
          class="pointer-events-auto absolute top-0 -z-10 h-full w-full bg-black bg-opacity-30"
          meeDialogBackdrop
          [@fadeAnimation]
        ></div>
      }
    </div>
  `,
  host: {
    class: 'fixed block top-0 bottom-0 left-0 right-0 overflow-auto pointer-events-none z-p',
  },
})
export class DialogContainer extends MeeDialogContainer {}

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
  return meeDialogPortal(DialogContainer);
}

export type Dialog = MeeDialog;
