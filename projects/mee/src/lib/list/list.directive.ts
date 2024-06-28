import { Directive } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[meeListStyle]',
  host: {
    class:
      'flex items-center gap-b2 w-full py-b2 px-b2 hover:bg-muted-background cursor-pointer rounded-md focus:bg-muted-background outline-none text-sm text-left',
  },
})
export class ListStyle {}
