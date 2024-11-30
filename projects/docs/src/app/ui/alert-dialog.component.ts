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
    <app-doc-code [tsCode]="tsCode">
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
export class AlertDialogComponent {
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
