import { ChangeDetectionStrategy, Component, ViewContainerRef, viewChild } from '@angular/core';

@Component({
  standalone: true,
  selector: 'mee-portal',
  template: `<ng-container #myDialog />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Portal {
  myDialog = viewChild('myDialog', { read: ViewContainerRef });
}
