import { Component, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: '[meeDialogTitle]',
  template: `<ng-content></ng-content>`,
  styles: `
    :host {
      @apply text-lg font-semibold;
    }
  `,
})
export class DialogTitle {}
