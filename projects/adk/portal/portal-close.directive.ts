import { Directive, inject, input } from '@angular/core';
import { DialogRef } from './dialog-ref';

@Directive({
  selector: '[ngbPortalClose]',
  host: {
    '(click)': 'close()',
  },
})
export class NgbPortalClose {
  readonly dialogRef = inject(DialogRef);
  readonly ngbPortalClose = input();

  close(data = this.ngbPortalClose()) {
    this.dialogRef.close(data);
  }
}
