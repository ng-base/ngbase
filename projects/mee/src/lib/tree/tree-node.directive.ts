import { Directive, input } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[meeTreeNodeDef]',
})
export class TreeNodeDef<T> {
  meeTreeNodeDefWhen = input<(index: number, node: T) => boolean>();
}

@Directive({
  standalone: true,
  selector: '[meeTreeNodeContent]',
  host: {
    class: 'ml-8',
  },
})
export class TreeNodeContent {}
