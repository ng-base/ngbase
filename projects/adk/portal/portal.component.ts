import { ChangeDetectionStrategy, Component, ViewContainerRef, viewChild } from '@angular/core';

@Component({
  selector: 'ngb-portal',
  template: `<ng-container #myDialog />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Portal {
  myDialog = viewChild('myDialog', { read: ViewContainerRef });
}
