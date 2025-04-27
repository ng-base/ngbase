import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { DialogRef } from '@ngbase/adk/portal';
import { render, RenderResult } from '@ngbase/adk/test';
import { aliasSheet, NgbSheetContainer } from './sheet';
import { createHostAnimation, fadeAnimation } from '@ngbase/adk/utils';
import { sideAnimation } from '@ngbase/adk/dialog';
import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';

const options = { title: 'Drawer' };
const mockDialogRef = new DialogRef(
  options,
  () => jest.fn(),
  () => jest.fn(),
  true,
);

@Component({
  selector: 'mee-sheet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [aliasSheet(SheetTest)],
  imports: [NgStyle],
  template: `
    <div [class]="options.position === 'left' ? 'justify-start' : 'justify-end'">
      <div
        [@sideAnimation]="position()"
        [ngStyle]="{
          width: options.width,
          minWidth: options.minWidth,
          maxWidth: options.maxWidth,
        }"
      >
        @if (!isHideHeader) {
          <div class="flex items-center border-b px-4 py-2">
            <h2 class="flex-1 font-bold">{{ options.title }}</h2>
            <button meeButton="ghost" class="-mr-2 !p-2" (click)="close()">X</button>
          </div>
        }
        <div class="h-full overflow-auto p-4">
          <ng-container #myDialog />
        </div>
      </div>
    </div>
    @if (backdropColor) {
      <div [@fadeAnimation] (click)="close()"></div>
      <!-- [class]="status() ? 'pointer-events-auto' : 'pointer-events-none'" -->
    }
  `,
  host: {
    class: 'fixed block top-0 bottom-0 left-0 right-0  z-p',
  },
  animations: [
    createHostAnimation(['@fadeAnimation', '@sideAnimation']),
    fadeAnimation('300ms'),
    sideAnimation,
  ],
})
export class SheetTest extends NgbSheetContainer {}

describe('DrawerComponent', () => {
  let component: SheetTest;
  let view: RenderResult<SheetTest>;

  beforeEach(async () => {
    view = await render(SheetTest, [
      provideNoopAnimations(),
      { provide: DialogRef, useValue: mockDialogRef },
    ]);
    component = view.host;
    component.setOptions(options);
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
