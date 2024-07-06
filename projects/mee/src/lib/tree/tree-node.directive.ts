import { Directive, input } from '@angular/core';

type GetChildren<T> = (index: number, node: T) => T[];

@Directive({
  standalone: true,
  selector: '[meeTreeNodeDef]',
})
export class TreeNodeDef<T> {
  meeTreeNodeDefWhen = input<GetChildren<T>>();
}

@Directive({
  standalone: true,
  selector: '[meeTreeNodeContent]',
  host: {
    class: 'ml-8',
  },
})
export class TreeNodeContent {}
