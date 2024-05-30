import { Component, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'mee-badge, [meeBadge]',
  template: `<ng-content></ng-content>`,
  host: {
    class:
      'inline-block bg-background rounded-full px-b/2 py-b/4 text-xs font-semibold',
  },
})
export class Badge {}
