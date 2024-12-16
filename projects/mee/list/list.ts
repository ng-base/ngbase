import { Directive } from '@angular/core';
import { MeeList, MeeListActionGroup } from '@meeui/adk/list';

@Directive({
  selector: '[meeListStyle]',
  host: {
    class:
      'flex items-center gap-b2 py-b2 px-b2 hover:bg-muted-background cursor-pointer rounded-md text-left data-[focus="true"]:bg-muted-background',
  },
})
export class ListStyle {}

@Directive({
  selector: '[meeList]',
  host: {
    role: 'list',
    '[class]': 'disabled() ? "pointer-events-none cursor-not-allowed opacity-50" : ""',
  },
  hostDirectives: [ListStyle],
})
export class List extends MeeList {}

@Directive({
  selector: '[meeActionGroup]',
  hostDirectives: [MeeListActionGroup],
})
export class ListActionGroup {}
