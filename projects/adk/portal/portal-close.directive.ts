import { Directive, inject, input } from '@angular/core';
import { DialogRef } from './dialog-ref';

@Directive({
  selector: '[ngbPortalClose]',
  host: {
    '(click)': 'close()',
  },
})
export class NgbPortalClose {
  private readonly dialogRef = inject(DialogRef);
  readonly ngbPortalClose = input();

  close() {
    this.dialogRef.close(this.ngbPortalClose());
  }
}
