import {
  ChangeDetectionStrategy,
  Component,
  ViewContainerRef,
  viewChild,
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'mee-portal',
  template: `<ng-container #myDialog></ng-container>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Portal {
  myDialog = viewChild('myDialog', { read: ViewContainerRef });
}
