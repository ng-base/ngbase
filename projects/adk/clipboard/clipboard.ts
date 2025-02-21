import { Directive, input } from '@angular/core';

@Directive({
  selector: '[ngbCopyToClipboard]',
  host: {
    class: 'cursor-pointer',
    '(click)': 'onClick($event)',
  },
})
export class CopyToClipboard {
  readonly ngbCopyToClipboard = input<string>();

  onClick(event: MouseEvent): void {
    event.preventDefault();
    const textToCopy = this.ngbCopyToClipboard();
    if (!textToCopy) return;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        console.log('Text copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  }
}
