import { ChangeDetectionStrategy, Component, ViewContainerRef, viewChild } from '@angular/core';

@Component({
  selector: 'mee-portal',
  template: `<ng-container #myDialog />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Portal {
  myDialog = viewChild('myDialog', { read: ViewContainerRef });
}
