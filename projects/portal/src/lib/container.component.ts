import {
  ChangeDetectionStrategy,
  Component,
  ViewContainerRef,
  inject,
  viewChild,
} from '@angular/core';
import { DialogRef } from './dialog-ref';

@Component({
  standalone: true,
  selector: 'mee-portal-container',
  template: `<ng-container #myDialog></ng-container>
    @if (options.backdropColor && !options.fullWindow) {
      <div
        class="backdropColor absolute top-0 -z-10 h-full w-full"
        (click)="close()"
        [@fadeAnimation]
      ></div>
    } `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'fixed top-0 left-0 w-full h-full pointer-events-none',
  },
})
export class PortalContainerComponent {
  myDialog = viewChild('myDialog', { read: ViewContainerRef });
  dialogRef = inject(DialogRef);
  options = this.dialogRef.options;

  close() {
    this.dialogRef.close();
  }
}
