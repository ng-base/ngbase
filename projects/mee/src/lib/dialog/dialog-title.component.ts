import { Component, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: '[meeDialogTitle]',
  template: `<ng-content></ng-content>`,
  host: {
    class: 'text-lg font-semibold',
  },
})
export class DialogTitle {}
