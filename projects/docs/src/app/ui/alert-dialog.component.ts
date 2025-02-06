import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { alertPortal } from '@meeui/ui/alert';
import { Button } from '@meeui/ui/button';
import { Heading } from '@meeui/ui/typography';
import { DocCode } from './code.component';

@Component({
  selector: 'app-alert-dialog',
  imports: [FormsModule, Heading, Button, DocCode],
  template: `
    <!-- <p>Components</p> -->
    <h4 meeHeader="sm" class="mb-5" id="alertDialogPage">Alert Dialog</h4>
    <app-doc-code [tsCode]="tsCode" [adkCode]="adkCode">
      <button meeButton (click)="openAlert()">Open alert</button>
    </app-doc-code>
    <!-- <mee-selectable [(activeIndex)]="selected" class="mb-b2 text-xs">
      <mee-selectable-item [value]="1">Preview</mee-selectable-item>
      <mee-selectable-item [value]="2">Source</mee-selectable-item>
    </mee-selectable>

    @if (selected() === 1) {
      <div class="grid min-h-80 place-items-center rounded-base border bg-background">
        <button meeButton (click)="openAlert()">Open alert</button>
      </div>
    } @else {
      <mee-tabs class="small dark overflow-hidden rounded-base border bg-black text-xs">
        <mee-tab label="HTML" class="!p-0">
          <div [innerHTML]="html()"></div>
        </mee-tab>
        <mee-tab label="Typescript" class="!p-0">
          <div [innerHTML]="ts()"></div>
        </mee-tab>
      </mee-tabs>
    } -->
  `,
})
export default class AlertDialogComponent {
  alert = alertPortal();
  tsCode = `
  import { alertPortal } from '@meeui/ui/alert';

  @Component({
    selector: 'app-root',
    template: \`<button (click)="openAlert()">Open alert</button>\`,
  })
  export class AppComponent {
    alert = alertPortal();

    openAlert() {
      this.alert.open({
        title: 'Are you absolutely sure?',
        description: \`This alert cannot be dismissed using the "esc" key or touching the "backdrop".
                      Select any option to close the alert.\`,
        actions: [
          { text: 'Cancel', type: 'ghost', handler: close => close() },
          { text: 'Continue', handler: close => close() },
        ],
      });
    }
  }
  `;

  adkCode = `
  import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
  import { DialogInput, DialogOptions, DialogRef } from '@meeui/adk/portal';
  import { Button, ButtonVariant } from '@/ui/button';
  import { dialogPortal } from '@/ui/dialog';

  export interface AlertOptions {
    title?: string;
    description?: string;
    actions?: {
      text: string;
      type?: ButtonVariant;
      handler: (fn: VoidFunction) => any;
    }[];
  }

  export function alertPortal() {
    const base = dialogPortal();

    function open<T>(opt: AlertOptions, comp?: DialogInput<T>) {
      const options: DialogOptions = {
        ...new DialogOptions(),
        data: opt,
        title: opt.title,
        width: '32rem',
        maxWidth: '95vw',
        disableClose: true,
        header: true,
        focusTrap: true,
      };

      const diaRef = base.open(comp || Alert, options);

      return diaRef;
    }

    function closeAll() {
      base.closeAll();
    }
    return { open, closeAll };
  }

  @Component({
    selector: 'mee-alert',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Button],
    template: \`
      <h4 class="mb-b2 text-base font-bold">{{ data?.title }}</h4>
      <p class="text-muted-foreground pb-b3">{{ data?.description }}</p>
      <div class="flex justify-end gap-4 pt-1">
        @for (action of data?.actions; track action) {
          <button [meeButton]="action.type || 'primary'" (click)="action.handler(diaRef.close)">
            {{ action.text }}
          </button>
        }
      </div>
    \`,
  })
  export class Alert {
    diaRef = inject<DialogRef<AlertOptions>>(DialogRef);

    data = this.diaRef.options?.data;
  }
  `;

  openAlert() {
    this.alert.open({
      title: 'Are you absolutely sure?',
      description: `This alert cannot be dismissed using the "esc" key or touching the "backdrop". Select any option to close the alert.`,
      actions: [
        { text: 'Cancel', type: 'ghost', handler: close => close() },
        { text: 'Continue', handler: close => close() },
      ],
    });
  }
}
