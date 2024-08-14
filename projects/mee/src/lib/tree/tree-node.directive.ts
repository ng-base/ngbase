import { Directive } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[meeTreeNodeDef]',
})
export class TreeNodeDef<T> {}

@Directive({
  standalone: true,
  selector: '[meeTreeNodeContent]',
  host: {
    class: 'ml-8',
  },
})
export class TreeNodeContent {}
