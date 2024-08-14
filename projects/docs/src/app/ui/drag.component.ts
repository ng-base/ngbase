import { Component } from '@angular/core';
import { DragMove } from '@meeui/drag';

@Component({
  standalone: true,
  selector: 'app-drag',
  imports: [DragMove],
  template: `<div meeDragMove class="h-20 w-20 border bg-foreground"></div> `,
  host: {
    class: 'flex items-center justify-center overflow-hidden h-96 w-96 bg-background',
  },
})
export class DragComponent {}
