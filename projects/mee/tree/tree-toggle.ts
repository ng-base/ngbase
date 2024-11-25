import { Directive } from '@angular/core';
import { MeeTreeNodeContent, MeeTreeNodeDef, MeeTreeNodeToggle } from '@meeui/adk/tree';

@Directive({
  selector: '[meeTreeNodeToggle]',
  hostDirectives: [MeeTreeNodeToggle],
  host: {
    class: `aria-[hidden="true"]:invisible`,
  },
})
export class TreeNodeToggle {}

@Directive({
  selector: '[meeTreeNodeDef]',
  hostDirectives: [MeeTreeNodeDef],
})
export class TreeNodeDef<T> {}

@Directive({
  selector: '[meeTreeNodeContent]',
  hostDirectives: [MeeTreeNodeContent],
  host: {
    class: 'ml-8',
  },
})
export class TreeNodeContent {}
