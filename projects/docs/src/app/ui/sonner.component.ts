import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { HoverCard } from '@meeui/hover-card';
import { Button } from '@meeui/button';
import { DialogClose } from '@meeui/dialog';
import { sonnerPortal } from '@meeui/sonner';
import { DocCode } from './code.component';

@Component({
  standalone: true,
  selector: 'app-sonner',
  imports: [Heading, Button, DialogClose, HoverCard, DocCode],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="sonnerPage">Sonner</h4>

    <app-doc-code [tsCode]="tsCode">
      <button meeButton (click)="addMessage()" class="mr-2">Default</button>
      <button meeButton (click)="addMessage('info')" class="mr-2">Info</button>
      <button meeButton (click)="addMessage('success')" class="mr-2">Success</button>
      <button meeButton (click)="addMessage('error')" class="mr-2">Error</button>
      <button meeButton (click)="addMessage('warning')" class="mr-2">Warning</button>
      <button meeButton (click)="clearMessage()">Clear Message</button>
    </app-doc-code>
  `,
})
export class SonnerComponent {
  sonner = sonnerPortal();

  tsCode = `
  import { Component } from '@angular/core';
  import { sonnerPortal } from '@meeui/sonner';

  @Component({
    standalone: true,
    selector: 'app-root',
    template: \`
      <button (click)="addMessage()">Sonner</button>
      <button (click)="clearMessage()">Clear Message</button>
    \`
  })
  export class AppComponent {
    sonner = sonnerPortal();

    addMessage() {
      this.sonner.add('Event has been created', 'Sunday, December 03, 2023 at 9:00 AM');
    }

    clearMessage() {
      this.sonner.closeAll();
    }
  }
  `;

  addMessage(type: 'success' | 'error' | 'warning' | 'info' | 'message' = 'message') {
    this.sonner[type]('Event has been created');
  }

  clearMessage() {
    this.sonner.closeAll();
  }
}
